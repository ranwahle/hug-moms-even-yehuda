import { Component, OnInit } from '@angular/core';
import { MatGridAvatarCssMatStyler } from '../../../node_modules/@angular/material';
import { GridSettings } from '../../../node_modules/radweb';
import { DeliveryEvents } from '../models';
import { SetDeliveryActiveAction } from './set-delivery-active-action';
import { CopyFamiliesToActiveEventAction } from './copy-families-to-active-event-action';
import { SelectService } from '../select-popup/select-service';

@Component({
  selector: 'app-delivery-events',
  templateUrl: './delivery-events.component.html',
  styleUrls: ['./delivery-events.component.scss']
})
export class DeliveryEventsComponent implements OnInit {
  deliveryEvents = new GridSettings(new DeliveryEvents(), {
    allowUpdate: true,
    allowInsert: true,
    columnSettings: e => [
      {
        column: e.name,
        width: '100'
      },
      e.deliveryDate,
      e.families,
      {
        caption: 'סטטוס',
        getValue: e => e.isActiveEvent.value ? "נוכחי" : "ארכיון"
      }
    ],
    get: {
      orderBy: e => [
        { column: e.isActiveEvent, descending: true },
        { column: e.deliveryDate, descending: true }
      ]
    },
    rowButtons: [
      {
        name: 'קבע כנוכחי',
        visible: e => !e.isActiveEvent.value && !e.isNew(),
        click: async e => {
          try {
            await new SetDeliveryActiveAction().run({ newDeliveryEventId: e.id.value });
            this.deliveryEvents.getRecords();

          } catch (err) {
            alert(err);
          }
        }
      },
      {
        name: 'העתק משפחות לאירוע נוכחי',
        visible: e => !e.isActiveEvent.value && !e.isNew(),
        click: async e => {
          try {
            this.dialog.YesNoQuestion("פעולה זו תעתיק את כל המשפחות שהשתתפו באירוע \"" + e.name.value + "\" לאירוע הנוכחי. האם להמשיך?", async () => {
              await new CopyFamiliesToActiveEventAction().run({ fromDeliveryEvent: e.id.value });
              this.deliveryEvents.getRecords();
            });

          } catch (err) {
            alert(err);
          }
        }
      }
    ]
  });
  constructor(private dialog: SelectService) { }

  ngOnInit() {
  }

}

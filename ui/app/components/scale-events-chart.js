import Component from '@ember/component';
import { computed } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';

@classic
@tagName('')
export default class ScaleEventsChart extends Component {
  events = [];

  activeEvent = null;

  @computed('events.[]')
  get data() {
    const data = this.events.filterBy('hasCount');

    // Extend the domain of the chart to the current time
    data.push({
      time: new Date(),
      count: data.lastObject.count,
    });

    // Make sure the domain of the chart includes the first annotation
    const firstAnnotation = this.annotations.sortBy('time')[0];
    if (firstAnnotation && firstAnnotation.time < data[0].time) {
      data.unshift({
        time: firstAnnotation.time,
        count: data[0].count,
      });
    }

    return data.sortBy('time');
  }

  @computed('events.[]')
  get annotations() {
    return this.events.rejectBy('hasCount').map(ev => ({
      type: ev.error ? 'error' : 'info',
      time: ev.time,
      event: ev,
    }));
  }

  toggleEvent(ev) {
    if (this.activeEvent === ev) {
      this.closeEventDetails();
    } else {
      this.set('activeEvent', ev);
    }
  }

  closeEventDetails() {
    this.set('activeEvent', null);
  }
}

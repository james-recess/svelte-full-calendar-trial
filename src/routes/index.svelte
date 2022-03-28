<script>
  import { onMount } from 'svelte';
  import Comp from '../components/Comp.svelte';
  import { writable, get } from 'svelte/store';
  import { format, addDays } from 'date-fns';

  let container;
  let calendar;

  const activeRange = writable(null);
  function getCurrentRange() {
    activeRange.set({
      start: calendar.view.activeStart,
      end: calendar.view.activeEnd,
    });
  }

  const events = [
    {
      allDay: false,
      timezone: 'local',
      title: 'Class',
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      extendedProps: {
        class: {
          id: 1,
          name: 'Class',
          instructors: [
            {
              first_name: 'James',
              last_name: 'Yu',
            },
            {
              first_name: 'hey',
              last_name: 'hey',
            },
          ],
        },
      },
    },
  ];

  onMount(async () => {
    if (calendar) return;

    const [core, interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin] = await Promise.all([
      import('@fullcalendar/core'),
      import('@fullcalendar/interaction'),
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/timegrid'),
      import('@fullcalendar/list'),
    ]);

    calendar = new core.Calendar(container, {
      plugins: [
        interactionPlugin.default,
        dayGridPlugin.default,
        timeGridPlugin.default,
        listPlugin.default,
      ],
      defaultView: 'timeGridWeek',
      header: null,
      events: (fetchInfo, successCallback, failureCallback) => {
        successCallback(events || []);
      },
      eventRender: (info) => {
        info.el.style.overflow = 'hidden';
        info.el.style.color = 'black';
        if (!info.event.extendedProps.class?.id) {
          return;
        }
        let newItem = document.getElementById(`event-class-${info.event.extendedProps.class.id}`);
        let [oldItem] = info.el.getElementsByClassName('fc-content');
        if (oldItem && newItem) {
          oldItem.parentNode.replaceChild(newItem.cloneNode(true), oldItem);
        }
      },
      columnHeaderFormat: function (date) {
        console.log(date.date.marker, formatter(date.date.marker));
        return formatter(addDays(date.date.marker, 1));
      },
      datesRender: (info) => {
        const columnHeaders = info.el.getElementsByClassName('fc-day-header');
        if (columnHeaders.length) {
          for (const columnHeader of columnHeaders) {
            const [weekday, day] = columnHeader.firstChild.textContent.split(' ');
            columnHeader.removeChild(columnHeader.firstChild);

            const weekdayElement = document.createElement('span');
            weekdayElement.innerHTML = weekday;
            weekdayElement.style.cssText = 'font-weight: normal;';
            columnHeader.appendChild(weekdayElement);

            const breakElement = document.createElement('br');
            columnHeader.appendChild(breakElement);

            const dayElement = document.createElement('span');
            dayElement.innerHTML = day;
            columnHeader.appendChild(dayElement);
          }
        }

        const fcbgElements = info.el.getElementsByClassName('fc-bg');
        els[0].parentNode.parentNode.removeChild(els[0].parentNode);

        // console.log('thElements', thElements);
        // const trElement = thElements.length ? thElements[0].parentNode : null;
        // console.log(trElement);
        // if (trElement) {
        //   trElement.parentNode.removeChild(trElement);
        // }
        // trElement.parentNode.removeChild(trElement);

        // const columns = info.el.getElementsByClassName('fc-day');
        // if (columns?.length) {
        //   for (let i = 0; i < columns.length; i++) {
        //     if (i % 2 === 0) {
        //       columns[i].style.cssText = 'background-color: red;';
        //     }
        //   }
        // }
      },
      // validRange: {
      //   start: '2022-01-01',
      //   end: '2022-05-05',
      // },
    });

    calendar.render();
    getCurrentRange();
  });

  function formatter(date) {
    return format(date, 'EEE d');
  }

  function gotoPrev() {
    calendar.prev();
    getCurrentRange();
  }

  function gotoToday() {
    calendar.today();
    getCurrentRange();
  }

  function gotoNext() {
    calendar.next();
    getCurrentRange();
  }
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div class="container">
  <div class="calendar" bind:this={container} />

  <div>
    <button on:click={gotoPrev}>{'<'}</button>
    <button on:click={gotoToday}>Today</button>
    <button on:click={gotoNext}>{'>'}</button>
  </div>

  <div>
    <button on:click={getCurrentRange}> get current range </button>
  </div>

  <div class="hidden-comp-container">
    {#each events || [] as event, index}
      <div id={`event-class-${event.extendedProps.id}`}>
        <Comp {event} />
      </div>
    {/each}
  </div>
</div>

<style>
  .hidden-comp-container {
    display: none;
  }
  td.fc-day:nth-child(even) {
    background-color: red;
  }
</style>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import customViewPlugin from '../plugins/custom-view-file.js';
  import Comp from '../components/Comp.svelte';
  import { readable } from 'svelte/store';

  let container;
  let calendar;

  const events = readable([
    {
      // this object will be "parsed" into an Event Object
      allDay: false,
      timezone: 'local',
      title: 'The Titl', // a property!
      // start: '2022-03-14T10:00:00-05:00', // a property!
      // end: '2022-03-14T12:00:00-05:00', // a property! ** see important note below about 'end' **
      start: '2022-03-14T10:00:00', // a property!
      end: '2022-03-14T12:00:00', // a property! ** see important note below about 'end' **
      extendedProps: {
        id: 0,
        a: 10,
        b: 20,
      },
    },
    {
      // this object will be "parsed" into an Event Object
      allDay: false,
      timezone: 'local',
      title: 'The Titl', // a property!
      // start: '2022-03-14T10:00:00-05:00', // a property!
      // end: '2022-03-14T12:00:00-05:00', // a property! ** see important note below about 'end' **
      start: '2022-03-14T11:00:00', // a property!
      end: '2022-03-14T14:00:00', // a property! ** see important note below about 'end' **
      extendedProps: {
        id: 1,
        a: 30,
        b: 40,
      },
    },
  ]);

  let eventUnsubscribe;
  $: {
    if (events && calendar) {
      if (eventUnsubscribe) {
        eventUnsubscribe();
      }
      eventUnsubscribe = events.subscribe((_) => calendar.refetchEvents());
    }
  }
  onDestroy(() => eventUnsubscribe && eventUnsubscribe());

  onMount(async () => {
    calendar = new Calendar(container, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, customViewPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek',
      },
      events: $events,
      eventContent: (arg) => {
        const domNode = document.getElementById(`comp-container-${arg.event.extendedProps.id}`);
        return {
          domNodes: [domNode],
        };
      },
    });

    calendar.render();
  });
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div class="container">
  <div class="calendar" bind:this={container} />
  <div class="hidden-comp-container">
    {#each $events as event, index}
      <div id={`comp-container-${event.extendedProps.id}`}>
        <Comp {event} />
      </div>
    {/each}
  </div>
</div>

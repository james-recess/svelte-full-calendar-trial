<script>
  import { onMount } from 'svelte';
  import Comp from '../components/Comp.svelte';
  import { writable, get } from 'svelte/store';

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
        const newItem = document.getElementById(`event-class-${info.event.extendedProps.class.id}`);
        const [oldItem] = info.el.getElementsByClassName('fc-content');
        if (oldItem && newItem) {
          oldItem.parentNode.replaceChild(newItem.cloneNode(true), oldItem);
        }
      },
      // validRange: {
      //   start: '2022-01-01',
      //   end: '2022-05-05',
      // },
    });

    calendar.render();
    getCurrentRange();
  });

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
</style>

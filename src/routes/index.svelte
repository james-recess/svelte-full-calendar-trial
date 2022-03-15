<script>
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import customViewPlugin from '../plugins/custom-view-file.js';
  import Comp from '../components/Comp.svelte';
  import { readable, derived, writable, get } from 'svelte/store';
  import { fetchEvents as graphFetchEvents } from '../graph/events';

  let container;
  let calendar;

  const activeRange = writable(null);
  function getCurrentRange() {
    activeRange.set({
      start: calendar.view.activeStart,
      end: calendar.view.activeEnd,
    });
  }

  $: if ($activeRange) {
    fetchEvents();
  }

  const events = writable([]);
  async function fetchEvents() {
    const es = await graphFetchEvents($activeRange);
    events.set(es);
  }

  let eventUnsubscribe;
  $: {
    if (events && calendar) {
      if (eventUnsubscribe) {
        eventUnsubscribe();
      }
      eventUnsubscribe = events.subscribe((_) => setTimeout(() => calendar.refetchEvents(), 50));
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
      events: async (fetchInfo, successCallback, failureCallback) => {
        successCallback(events ? get(events) : []);
      },
      eventContent: (arg) => {
        const domNode = document.getElementById(`comp-container-${arg.event.extendedProps.id}`);

        if (domNode === null) {
          return { domNodes: [] };
        }

        const clone = domNode.cloneNode(true);
        return { domNodes: [clone] };
        // return { html: '<i>some</i>' };
      },
      validRange: {
        start: '2022-01-01',
        end: '2022-05-05',
      },
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
    {#each $events || [] as event, index}
      <div id={`comp-container-${event.extendedProps.id}`}>
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

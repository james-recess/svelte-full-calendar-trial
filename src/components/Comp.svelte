<script>
  export let event;
</script>

<div class="comp">
  Component {event.extendedProps.a}
  <p>{event.start}</p>
</div>

<style>
  .comp {
    overflow: hidden;
  }
</style>

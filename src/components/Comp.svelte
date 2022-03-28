<script>
  export let event;

  console.log('event', event);
</script>

<div class="comp">
  {event.title}
  hello
</div>

<style>
  .comp {
    overflow: hidden;
  }
</style>

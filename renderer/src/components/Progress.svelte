<script>

    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";  
    
    export let progress = 0 
    
    const progressbar = tweened(0, {
        duration: 400,
        easing: cubicOut
    });


    $: progressbar.set(progress)
</script>


<div class="w-full bg-rose-200 h-1">
    <div class="h-full bg-red-500" style="width : {$progressbar}%"></div>

</div>

<script>
	import {onMount } from 'svelte'

	import Nav from '../components/Nav.svelte';

	import { ingradients,  checkedIngradients} from '../stores/ingradients'
	


	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	
	import Progress from '../components/Progress.svelte'

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		} 
	});


	let  recipes = [];
    
	$: filterRecipes = recipes.filter( x => {
		for(const ingradient of $checkedIngradients) {
			return x.doc.selected.some(y => y.id == ingradient._id )
		}


	})
	const filterIngradients = (data) => {
			$ingradients = [ ...data.map(x => x.doc)]
			const checked= []
			$ingradients .forEach(element => {
				const id = element._id
				
				if($checkedIngradients.findIndex(x => x._id == id) != -1) {
					checked.push($checkedIngradients.findIndex(x => x._id == id))
					
				}
			});


			checked.forEach(x => {
				$ingradients.shift(x)
			})
			$ingradients = $ingradients


		}
	onMount(() => {
		const { receive} = window.api
		const { invoke } = window.api.electron.ipcRenderer
		invoke('filterIngradient', "").then(data => filterIngradients(data))


	
		invoke('get-recipes').then(data=> {
			recipes = data
		})


		receive('new-recipe-added' , () =>  {
			invoke('get-recipes').then(data=> {
				recipes = data
			})
		})

	})



	async function handleFilter({target}) {


				
		const val = target.value
		const {invoke} = window.api.electron.ipcRenderer
		invoke('filterIngradient', val)
		.then(data => filterIngradients(data))
		
	}



	function handleSelect(ingradient) {
		$checkedIngradients = [...$checkedIngradients, ingradient]
		$ingradients  = $ingradients.filter(x => {
			return  x._id != ingradient._id
		})

		
		$ingradients = $ingradients
	}


	function handleDeSelect(ingradient) {
	

		const deselected = $checkedIngradients.find( x => x._id == ingradient)

		$ingradients = [...$ingradients, deselected]

		$checkedIngradients = $checkedIngradients.filter( x => x._id != ingradient)


	}

	

	function extraIngradient(ingradients /** üründeki malzeme*/) {

		return   $checkedIngradients.filter(x /** seçili malzeme*/=> {
				/** içinde seçili malzeme varsa */
				
				return  !ingradients.some( ingradient => ingradient.id == x._id )
		}).map(x => x.name)

	}


	function handleProgress(ingradients) {

		const progress = $checkedIngradients.filter( x => ingradients.some(y => y.id == x._id)).length


		return (100 * progress) / ingradients.length;
	
	

	}
</script> 

<Nav />
<div class="flex p-6 h-full">


	<div class="pr-12 flex-1">
		<div class="">
			<input type="text" class="border-1 border-solid mb-6 border-rose-400 rounded"
			
			on:keyup={handleFilter}
			placeholder="Malzeme filtrele">
		</div>



		<div class="flex flex-wrap gap-3 select-none flex-1 h-42 overflow-y-scroll">
		
			{#each $ingradients as ingradient , index}
					<span 
					
					in:receive="{{key: ingradient._id}}"
					out:send="{{key: ingradient._id}}"
					class="p-3 w-46 min-w-46 bg-rose-400 rounded cursor-pointer" on:click={() => handleSelect( ingradient)}>
					
					
						{ingradient.name} 
					</span>
			
			{/each}
		
		</div> 
		
		
		
		<div>
			<h2 class=" border-solid border-t-1 border-r-dark-500 my-12">Secililer</h2>
		
		
			<div class="flex flex-wrap gap-3 h-42 overflow-y-scroll">
				{#each $checkedIngradients as ingradient}
				<span 
				in:receive="{{key: ingradient._id}}"
				out:send="{{key: ingradient._id}}"
				class="inline p-3 w-46 min-w-46 bg-rose-400 rounded cursor-pointer" 

			
				on:click={() => handleDeSelect(ingradient._id)}>
		
				
					{ingradient.name} 
				</span>
		
			{/each}
	
			</div>
		</div>
		
	</div>

	<div class="w-full border-rose-900 border-solid border-1 p-3  w-112 h-126 overflow-y-scroll">


		<ul class="flex flex-col gap-3">
			{#if $checkedIngradients.length > 0}
			{#each  filterRecipes as {doc}}
			<li>
				<div class="border border-1 border-rose-400">
					<div class="bg-red-400 ">
						<h2 class="w-full p-3  font-semibold uppercase">{doc.recipeName}</h2>
					
						<div class="flex bg-white px-3 pt-2">
						
									<h2 class=" font-semibold flex w-full"> 
										<div class="flex-1">Tarifi</div>
										<div class="w-6">
											<img src="/time.gif" class="w-5" alt="">
										</div>
										<span>{doc.cookingTime} dk</span>
									</h2>
							
									
							
						
						</div>
						<p class="flex-1   px-3 bg-white">{doc.recipe} </p>
						<div class="px-3 bg-white font-semibold">
							<h2>Malzemeler</h2>
						</div>
						<div class="bg-white p-3 flex gap-3  flex-wrap">
							{#each doc.selected as ingradient }
								<span class="bg-rose-400 px-2 rounded">
									{ingradient.doc.name}
								</span>
							{/each}
						</div>
					</div>
					<div class="p-3">
						{#if extraIngradient(doc.selected).length > 0} 
							<h2 class="font-semibold">Fazladan malzeme</h2>
							<div class="flex gap-3  flex-wrap">
								{#each extraIngradient(doc.selected) as ingradient }
									<span class="bg-rose-400 px-2 rounded">
										{ingradient}
									</span>
								{/each}
							</div>
						{/if}
						
					</div>


					<div class="w-full ">
						<Progress progress={handleProgress(doc.selected)} />
					</div>
				</div>
			</li>
			{/each}
			{:else}
				{#each  recipes  as {doc}, index}
				<li>
					<div class="border border-1 border-rose-400">
						<div class="bg-red-400 ">
							<h2 class="w-full p-3  font-semibold uppercase">{doc.recipeName}</h2>
						
							<div class="flex bg-white px-3 pt-2">
							
										<h2 class=" font-semibold flex w-full"> 
											<div class="flex-1">Tarifi</div>
											<div class="w-6">
												<img src="/time.gif" class="w-5" alt="">
											</div>
											<span>{doc.cookingTime} dk</span>
										</h2>
								
										
								
							
							</div>
							<p class="flex-1   px-3 bg-white">{doc.recipe} </p>
							<div class="px-3 bg-white font-semibold">
								<h2>Malzemeler</h2>
							</div>
							<div class="bg-white p-3 flex gap-3 flex-wrap">
								{#each doc.selected as ingradient }
									<span class="bg-rose-400 px-2 rounded">
										{ingradient.doc.name}
									</span>
								{/each}
							</div>
						</div>
						
					</div>
				</li>
				{/each}
			{/if}
				
		</ul>
	</div>
</div>

<svelte:head>
	<title>Ne yemek yapsam</title>
</svelte:head>





<style>
	input::placeholder {
		@apply pl-3;
	}


	/* width */
::-webkit-scrollbar {
  width: 10px;
  @apply cursor-pointer;
}


	/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  @apply bg-red-400;
  @apply cursor-pointer;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	@apply bg-red-500; 
}
</style>

<script>
	import {onMount } from 'svelte'

	import { ingradients, recipes} from '../stores/ingradients'
	


	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

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

	let selected = []
	let recipeName = "" , cookingTime , recipe = ""; 

	const filterIngradients = (data) => {
			

		
		$ingradients = [ ...data]
		const checked= []
		$ingradients .forEach(element => {
			const id = element.doc._id
			
			if(selected.findIndex(x => x.doc._id == id) != -1) {
				checked.push(selected.findIndex(x => x.doc._id == id))
				
			}
		})


	}
	
	onMount(async () => {
		const ipc = window.api
		const { invoke } = ipc.electron.ipcRenderer

		const ingradients_ =  await invoke('ingradients').then(data => data)

		$ingradients = ingradients_.rows


	
	
	})

	async function handleFilter() {



		const val = ingradientName
		const {invoke} = window.api.electron.ipcRenderer
		invoke('filterIngradient', val)
		.then(data => filterIngradients(data))
		 
	}





	let ingradientName = ""
	async function handleAddIngradient(e) {
		e.preventDefault()
		e.stopPropagation()
		const ipc = window.api

		// emit sahte event

		const {invoke} = window.api.electron.ipcRenderer
		ipc.send('addIngradient', ingradientName)
		invoke('filterIngradient', "")
		.then(data => filterIngradients(data))
		ingradientName = ""
	
	}



	function handleSelect(ingradient) {
		selected = [...selected, ingradient]
		$ingradients  = $ingradients.filter(x =>  x.doc._id != ingradient.doc._id)

		
		$ingradients = $ingradients
	}


	function handleDeSelect(ingradient) {
		selected = selected.filter(x => x.doc._id != ingradient.doc._id)

		selected = selected
		$ingradients = [...$ingradients, ingradient]
	
	}




	function handleAddRecipe() {

		if(selected.length > 0 && recipeName !== "" && cookingTime > 0 && recipe !== "") {
			
		const electron = window.api.electron
		const { invoke } = electron.ipcRenderer

		invoke('add-recipe' ,  {selected, recipeName, cookingTime, recipe}).then( () => {

			alert('Eklendi')
			window.close()
		})


		} else {
			alert("en az 1 malzeme seçiniz ve alanları boş bırakmayınız")
		}
	}



</script> 
<svelte:head>
	<title>Tarif ekle</title>
</svelte:head>

<div class="flex">

	<div class="w-full">

		<div class="flex">


			<div class="flex p-6">
				<input type="text" class="border-1 border-solid mb-6 border-rose-400 rounded"
				bind:value={ingradientName}
				on:keyup={handleFilter}
				placeholder="Malzeme filtrele">

				<span
				on:click|preventDefault={handleAddIngradient}
				class="block ml-3 border-1 border-rose-400 border-solid rounded h-7 w-52 px-3">Malzeme listede yok</span>
			</div>

		</div>


		<div class="flex gap-3 flex-wrap  h-62 overflow-y-scroll p-6">
		{#each $ingradients as ingradient}
			<span 
			
			on:click={() => handleSelect(ingradient)}
			class="w-52 bg-red-400 p-3 rounded">{ingradient.doc.name}</span>
		{/each}
		</div>
		<div>
		<h2 class="mt-3 p-6 border-t-1 border-solid border-rose-400">Seçili malzemeler</h2>
		</div>

		<div class="flex gap-3 flex-wrap  h-62 overflow-y-scroll p-6">
		{#each selected  as ingradient}
			<span
			
		     on:click={() => handleDeSelect(ingradient)}
			class="w-52 bg-red-400 p-3 rounded">{ingradient.doc.name}</span>
		{/each}
		</div>
	</div>



	<div class="p-5 w-102">
		<div><button
			
			on:click={ handleAddRecipe}
			class="border-1 w-full border-solid mb-6 border-rose-400 p-2 rounded">Tarifi kaydet</button></div>
		<div><input
			bind:value={recipeName}
			type="text" 
			placeholder="yemek adı"
			class="border-1 w-full border-solid mb-6  p-2 border-rose-400 rounded" ></div>

		<div><input 
			bind:value={cookingTime}
			type="number" 
			placeholder="Pişirme süresi (dk)"
			class="border-1 w-full border-solid mb-6 p-2  border-rose-400 rounded" ></div>
		<div><textarea 
			bind:value={recipe}
			type="text" 
				placeholder="yemek tarifi"
				class="border-1 border-solid mb-6 p-2  border-rose-400 rounded w-full h-52" ></textarea> </div>
	</div>
</div>

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
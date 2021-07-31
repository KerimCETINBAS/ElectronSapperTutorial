<script>



	function handleAddRecipeWindow() {
		window.api.send('open-new-recipe-window')
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	
	span {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul class="flex items-end justify-end text-rose-500  text-md font-semibold">
		<li><span sapper:prefetch 
			
			
			on:click={handleAddRecipeWindow}
			class="hover:bg-rose-500 hover:text-white duration-300 transition-colors">Tarif ekle</span></li>

	</ul>
</nav>

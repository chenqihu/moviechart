<template>
  <div class="loading">
  	<div class="img-wrapper">
  		<img src="./loading.gif" height="50" width="50"/>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    
  };
</script>

<style lang="scss" scoped>
	.img-wrapper{
		position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
	}
  		
</style>

<template>
  <div id="app">
  <keep-alive exclude="movieDetail,search">
  	<router-view></router-view>
  </keep-alive>
    
  <v-footertab></v-footertab>
  
  </div>  
</template>

<script>
	import VFootertab from '@/components/footer-tab/footer-tab';
export default {
	data() {
      return {
        loadingFlag: false
      };
    },
    methods: {
    },
  	components:{
	  	VFootertab
  	}
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="footer-tab">
    <router-link tag="div" class="tab-item" to="/movie">
      <span class="tab-link" @click="goMaoyan">特惠购票</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  	methods:{
			goMaoyan(){
				location.href="http://m.maoyan.com/app"
			}
  	}
  };
</script>

<style lang="scss" scoped>
  @import "../../common/style/variable.scss";
  
  .footer-tab{
  	position: fixed;
    width: 100%;
    bottom: 0;
    background-color:red;
    display: flex;
    height: 40px;
    font-size: $font-size-medium;
    .tab-item {
    	flex: 1;
    	text-align: center;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    	justify-content: center;     
      .tab-link{
	      font-size: 16px;
	      color: #fff;  
	      font-weight: bold;
		  }
    }
  }
    
    
      
      
        
      
        
</style>

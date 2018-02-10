<template>
<div class='radio-cont'>
	<div class='radio-item' v-for='pd in pdata' @click='changeval(pd)'>
		<i :class='{"radio-icon":true,"active":pd.id==val.id,"uncheck":pd.id!=val.id}'></i>{{pd.text}}
	</div>
</div>
</template>
<script>
export default{
	name:'radios',
	model:{
		prop:'val',
		event:'change'
	},
	props:['val','pdata'],
	methods:{
		changeval(item){
			if(item.id==this.val.id){
				return ;
			}
			this.$emit('change',item);
			this.$emit('turn',item);
		}
	}

}
</script>
<style>
.radio-cont{display:inline-flex;font-size:0.3rem;color:#333;}
.radio-item{flex:1;white-space:nowrap;}
.radio-item + .radio-item{margin-left:0.5em;}
.radio-icon{display:inline-block;width:0.64rem;height:0.64rem;vertical-align: middle;}
.active{background:url(./../images/btn_radio_selected.png) center no-repeat;background-size:100% 100%;}
.uncheck{background:url(./../images/btn_radio_default.png) center no-repeat;background-size:100% 100%;}
</style>
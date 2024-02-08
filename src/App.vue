<template class="main">
  <div class="mainContainer">
   
  <h1>Películas</h1>
  <div class="buttonContainer"><div>
  <b-button variant="primary" v-b-modal.modal-1>Add movie here</b-button>
</div></div>
  <div class="moviesContainer">
    
    
    <div class="cardContainer">
  <b-card
    title="Card Title"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 20rem;"
    class="mb-2"
  >
    <b-card-text>
      Some quick example text to build on the card title and make up the bulk of the card's content.
    </b-card-text>

    <b-button href="#" variant="primary">Go somewhere</b-button>
  </b-card>
</div>
<div class="cardContainer"><h1>card</h1></div>

  </div>
<!--Modal-->
<div>
  <b-modal id="modal-1" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>
  </div>
  
</template>
<script>
export default{
methods:{
  addMovie(){
    console.log("creando película...")
  }

}
  
}
</script>

<style >
.main{
  display: flex;
}
.mainContainer{
  flex:1
}
.moviesContainer{
  display: flex;
}
.cardContainer{
  padding: 5%;
}
.buttonContainer{
  display: flex;
justify-content: end;
padding: 1%;
}
</style>

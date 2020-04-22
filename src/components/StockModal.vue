<template>
  <!-- The Modal -->
  <div v-show="false" id="myModal" class="modal" :style="modalStyle">
    <!-- Modal content -->
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>Some text in the Modal..</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockModal',
  computed: {
    modalStyle () {
      return { left: `${this.mouse.left}px`, top: `${this.mouse.top}px` }
    }
  }
}
</script>

<style scoped>

  /* The Modal (background) */
  .modal {
    /*display: none; !* Hidden by default *!*/
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    width: 240px; /* Full width */
    height: 200%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    /*background-color: rgb(0,0,0); !* Fallback color *!*/
    /*background-color: rgba(0,0,0,0.4); !* Black w/ opacity *!*/
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>

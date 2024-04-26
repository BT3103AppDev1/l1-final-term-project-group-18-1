<template>
  <div>
    <!-- Header words -->
    <h1 class="title">Contact Us</h1>
    <h2>Get in touch!</h2>

    <!-- email icon with ecoharbour email address -->
    <div class="email"> 
      <font-awesome-icon icon="envelope" class="emailicon" />
      <text class="contact-info">ecoharbour@gmail.com</text>
    </div>

    <!-- telegram icon with ecoharbour telegram handle -->
    <div class="telegram">
      <font-awesome-icon icon="fa-brands fa-telegram" class="telegramicon"/>
      <text class="contact-info">@ecoharbour</text>
    </div>
  </div>
</template>

<script>
  //get icons from font awesome 
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
  import { faTelegram } from '@fortawesome/free-brands-svg-icons'

  library.add(faEnvelope)
  library.add(faTelegram)

  export default {
    components: {
      FontAwesomeIcon
    }
  };
</script>

<style scoped>
/* Use the parent component's CSS to target the child component */

.settings-wrapper h1,
.settings-wrapper h2 {
  text-align: left;
  margin-bottom: 30px; 
  margin-left: 20px;
}

.settings-wrapper .email,
.settings-wrapper .telegram {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
}

.settings-wrapper .contact-info {
  font-weight: normal;
}

.settings-wrapper .emailicon {
    margin-right: 10px;
    size: 20px;
    color: #457247;
    font-size: 20px;
  }
  .settings-wrapper .telegramicon {
    margin-right: 10px;
    size: 20px;
    color: #24A1DE;
    font-size: 20px;
  }

.title {
  color: #457247;
}
</style>

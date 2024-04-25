<template>
  <div>
    <h1 class="title">Contact Us</h1>
    <h2>Get in touch!</h2>
    <div class="email"> 
      <font-awesome-icon icon="envelope" class="emailicon" />
      <text class="contact-info">ecoharbour@gmail.com</text>
    </div>
    <div class="telegram">
      <font-awesome-icon icon="fa-brands fa-telegram" class="telegramicon"/>
      <text class="contact-info">@ecoharbour</text>
    </div>
  </div>
</template>

<script>
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
.settings-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Aligns children to the start of the container */
}

.settings-wrapper h1,
.settings-wrapper h2 {
  text-align: left;
  margin-bottom: 30px; /* Only if you need space between the header and sub-header */
}

.settings-wrapper .email,
.settings-wrapper .telegram {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.settings-wrapper .emailicon,
.settings-wrapper .telegramicon {
  margin-right: 10px;
  font-size: 20px; /* 'size' is not a valid CSS property for font-size */
}

.settings-wrapper .contact-info {
  font-weight: normal;
}


.title {
  color: #457247;
}
</style>

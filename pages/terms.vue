<template>
  <header class="masthead" style="height:auto; padding-bottom:50px;">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-sm-12 text-center res-top">
          <div class="section-heading text-center" style="margin-bottom: 30px;">
            <h2 class="text-warning">Terms</h2>
            <!-- <p class=" text-white">Read Our Terms and Privacy.</p> -->
            <hr>
          </div>
        </div>

        <div class="col-md-12 text-Left mr-15">
          <div class="card card-pricing">
            <div class="content">
              <p>
                These Terms apply to all who purchase REGIONALE-ERNTE. By accessing the Service you agree to be bound by
                these Terms.
              </p>

              <h5 class="card-title font-25">Refund Policy:</h5>
              <p class="text-dark">
                We do not issue refunds after the REGIONALE-ERNTE purchase is made, which you are responsible for understanding
                to buy the script.
              </p>

              <h5 class="card-title font-25">Script Usage:</h5>

              <p class="text-dark">
                The ecommerce Scripts located on shopnx.in/codenx.com/REGIONALE-ERNTE Resources are made by Swadesh Behera, submitted by the
                author, or found in the public domain. They can be used freely on private or commercial sites unless stated
                otherwise by the script author in the copyright notice contained in the script and providing all credits
                to the author are left intact. They may be altered to conform with your site, but please leave all credit
                notes and copyright notices from the authors in place. The scripts remain the property of the author and
                any extra copyright policy by the author must be adheared to before using these scripts. codenx Resources
                retains the right to edit any copyrighted scripts it sees fit for display purposes only to make it conform
                with this site, it does not alter the script in any fashion from the authors original for download purposes.
              </p>

              <h5 class="card-title font-25">About The Script</h5>

              <p class="text-dark">
                These scripts are text files which can be opened with any text editor (notepad, word, etc), they have been
                compressed into .zip format to ensure the text format remains complete, as sending text files via standard
                html can destroy the format and present you with a corrupt script. You can open the .zip files with a program
                such as Winzip, a free program available from WinZip and extract the text file from inside into a directory
                of your choice. If you have any trouble using the scripts located on codenx Resources, please refer to the
                author page on this site for seeking help.
              </p>

              <h5 class="card-title font-25">Warranty</h5>

              <p class="text-dark">
                We do not guarantee they will function with all 3rd party scripts or web browsers. We are not responsible for
                any script compatibility conflicts that may occur. It is our policy to support our products as best we can
                and we will provide support for 3rd party scripts conflicts at our discretion or as time allows. We are not
                responsible for any data loss that may occur as a result of installing these products.
              </p>

              <h5 class="card-title font-25">License</h5>

              <p class="text-dark">Themes and Support are provided as is under the GPL 2.0 license.</p>

              <h5 class="card-title font-25">Browser Compatibility</h5>

              <p class="text-dark">
                Our REGIONALE-ERNTE support all modern web browsers including (but not limited to) Firefox, Safari, Chrome
                (all on PC & Mac). Whilst we strive to give every a seamless & near-identical experience across each of these
                browsers, it is impossible to compensate for the lack of web standards support (relating to HTML & CSS) in
                some of these browsers. In the case of a browser not support certain web standards, we will include a generic
                workaround for that browser, which will degrade a specific function / feature gradually and in a way that
                doesn’t affect the user experience negatively.
              </p>

              <h5 class="card-title font-25">Ownership</h5>

              <p class="text-dark">
                You may not claim intellectual or exclusive ownership to any of our product, modified or unmodified. All products
                are property of codenx. Our products are provided “as is” without warranty of any kind, either expressed
                or implied. In no event shall our juridical person be liable for any damages including, but not limited to,
                direct, indirect, special, incidental or consequential damages or other losses arising out of the use of
                or inability to use our product.
              </p>

              <h5 class="card-title font-25">Support</h5>

              <p
                class="text-dark"
              >We are not providing any future support, but we support for installation questions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  head() {
    return {
      title: this.$store.state.settings.shopName + " - Terms and Privacy Policy"
    };
  }
};
</script>

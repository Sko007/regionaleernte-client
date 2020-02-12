<template>
  <div>
    <breadcrumb :items="breadcrumb"></breadcrumb>
    <v-container>
      <v-flex lg6 offset-lg3 md6 offset-md3 sm8 offset-sm2>
        <v-form novalidate @submit.stop.prevent="save(userModel)" v-if="userModel">
          <v-card>
            <v-card-text>
              <v-text-field
                name="name"
                autofocus
                v-model="userModel.name"
                :label="$t('Name')"
                :hintText="$t('Name')"
                labelFloat
                icon="face"
                v-validate="'required'"
                :error-messages="errors.collect('name')"
              ></v-text-field>

              <v-text-field
                name="email"
                v-model="userModel.email"
                :label="$t('Email')"
                :hintText="$t('Email')"
                labelFloat
                icon="face"
                v-validate="'required|email'"
                :error-messages="errors.collect('email')"
              ></v-text-field>

              <v-text-field
                name="phone"
                v-model="userModel.phone"
                :label="$t('Phone No')"
                v-validate="'max:20|numeric'"
                :error-messages="errors.collect('phone')"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <submit
                :loading="loading"
                :disabled="errors.any()"
                :full="true"
                icon="save"
                text="Update"
                color="secondary"
              ></submit>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import Submit from "@/components/Submit";
import Breadcrumb from "@/components/Breadcrumb";
import { mapGetters, mapActions } from "vuex";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  layout: "account",
  data() {
    return {
      showImageModal: false,
      breadcrumb: [
        { text: "Dashboard", url: "/", disabled: false },
        { text: "Edit Profile", disabled: true }
      ]
    };
  },
  computed: {
    ...mapGetters({
      error: "error",
      loading: "loading"
    }),
    userModel() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  methods: {
    ...mapActions({
      clearError: "clearError"
    }),
    async save() {
      const result = await this.$validator.validateAll();

      if (!result) {
        return;
      } else {
        await this.$store.dispatch("auth/updateProfile", this.userModel);
      }
    }
  },
  components: {
    Submit,
    Breadcrumb
  },
  head() {
    return {
      title: "Update admin profile page"
    };
  }
};
</script>


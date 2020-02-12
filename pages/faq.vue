<template>
    <div class="faq">
        <h1>FAQ?</h1>
    </div>
</template>
<script>
export default {
  head() {
    return {
      title: "Frequently asked questions",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Most of your questions will be answered in this page. If you did not find, please feel free to use the contact us button at the footer section"
        }
      ]
    };
  }
};
</script>

<style type="text/css" scoped>
.faq {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.faq {
  font-family: Baloo, sans-serif;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: hsla(232, 91%, 49%, 1);
  background: -webkit-linear-gradient(
      45deg,
      hsla(232, 91%, 49%, 1) 0%,
      hsla(232, 91%, 49%, 0) 70%
    ),
    -webkit-linear-gradient(315deg, hsla(185, 98%, 42%, 1) 10%, hsla(
            185,
            98%,
            42%,
            0
          )
          80%),
    -webkit-linear-gradient(225deg, hsla(310, 98%, 47%, 1) 10%, hsla(
            310,
            98%,
            47%,
            0
          )
          80%),
    -webkit-linear-gradient(135deg, hsla(67, 94%, 43%, 1) 100%, hsla(
            67,
            94%,
            43%,
            0
          )
          70%);
  background: linear-gradient(
      45deg,
      hsla(232, 91%, 49%, 1) 0%,
      hsla(232, 91%, 49%, 0) 70%
    ),
    linear-gradient(
      135deg,
      hsla(185, 98%, 42%, 1) 10%,
      hsla(185, 98%, 42%, 0) 80%
    ),
    linear-gradient(
      225deg,
      hsla(310, 98%, 47%, 1) 10%,
      hsla(310, 98%, 47%, 0) 80%
    ),
    linear-gradient(
      315deg,
      hsla(67, 94%, 43%, 1) 100%,
      hsla(67, 94%, 43%, 0) 70%
    );
}
.faq > div {
  margin: 5vh 5vw;
  text-align: center;
  font-size: 5vh;
}
h1 {
  font-size: 2.4em;
  margin: 0 0 5vh;
}
p {
  margin: 5vh 0 5vh;
}
a {
  color: #fff;
  text-decoration: none;
}
a:hover {
  color: hsla(79, 97%, 47%, 1);
  text-decoration: underline;
}
.small {
  font-size: 0.6em;
}
</style>
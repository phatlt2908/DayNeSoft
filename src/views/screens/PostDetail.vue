<template>
  <div id="postDetail">
    <section class="section pt-0">
      <div class="container">
        <div class="columns">
          <div class="column is-three-quarters-desktop">
            <article v-if="loaded">
              <div class="content" v-html="postDetail.description"></div>
              <div class="content" v-html="postDetail.content"></div>
              <!-- Link download -->
              <div class="mt-5 mb-5" v-for="group in postLinkDownloads" :key="group.name">
                <h5 v-if="group.name && group.name != 'null'" class="title is-5">
                  {{ group.name }}:
                </h5>
                <div id="link">
                  <a class="button is-primary is-large mr-2" v-for="link in group.links" :key="link.id" target="_blank"
                    :href="link.url">
                    <span class="icon is-medium">
                      <font-awesome-icon icon="download" />
                    </span>
                    <span>{{ link.typeName }}</span>
                  </a>
                </div>
              </div>
              <article class="message is-success">
                <div class="message-body">
                  <p><strong>Mật khẩu giải nén</strong> mặc định của file cài đặt là <strong>dayne.run</strong></p>
                  <p>Nếu có khó khăn, vấn đề về link download hoặc gặp lỗi trong
                    quá trình cài đặt, bạn đừng ngần ngại để lại
                    <strong>bình luận</strong> hoặc <strong>phản hồi</strong> bên
                    dưới. Chúng mình sẽ trợ giúp nhanh nhất có thể nhé!<br />
                    Hy vọng những bài viết trên trang DayNe.run sẽ hữu ích đối với
                    bạn. Nếu có thiếu xót, rất mong góp ý từ mọi người!<br />
                    <em>Cảm ơn đã ghé vào DayNe.run ^^!</em>
                  </p>
                </div>
              </article>
              <hr />
              <comment id="comment" :postCode="postCode" />
            </article>
          </div>
          <div class="column">
            <side />
          </div>
        </div>
        <hr />
      </div>
    </section>

    <div class="container">
      <div class="mt-5">
        <div class="container">
          <h1 class="title">Liên quan</h1>
        </div>
        <Slider v-if="isLoadedRelation" :sliderList="relationPostList" />
        <div v-else class="columns is-centered">
          <font-awesome-icon icon="circle-notch" class="fa-spin" size="5x" />
        </div>
      </div>
    </div>

    <a href="#comment" class="button comment is-rounded is-primary is-medium">
      <span class="icon">
        <font-awesome-icon icon="comment" />
      </span>
    </a>

    <a href="#link" class="button download is-rounded is-primary is-medium">
      <span class="icon">
        <font-awesome-icon icon="download" />
      </span>
    </a>
  </div>
</template>

<script>
import Slider from "@/views/components/Slider.vue";
import Side from "@/views/components/Side.vue";
import Comment from "@/views/components/Comment.vue";
import postAPI from "@/services/postAPI";

export default {
  name: "PostDetail",
  components: {
    Slider,
    Side,
    Comment,
  },
  data() {
    return {
      loaded: false,
      postCode: null,
      postDetail: null,
      postLinkDownloads: null,
      relationPostList: null,
      isLoadedRelation: false,
    };
  },
  created() {
    this.postCode = this.$route.params.postCode;
    this.loadDetail();
  },
  mounted() {
    this.increaseReadNum();
  },
  methods: {
    loadDetail() {
      postAPI
        .getPostDetail(this.postCode)
        .then((res) => {
          this.postDetail = res.data.post;
          this.postLinkDownloads = this.groupLinkDownload(res.data.links);
          window.document.title = "Đây nè | " + this.postDetail.name;
          this.loaded = true;

          let heroDisplay = {
            categoryCode: this.postDetail.categoryCode,
            title: this.postDetail.name,
            subtitle: this.postDetail.title,
            subBread: this.postDetail.name,
          };

          this.$store.dispatch("changeCategory", heroDisplay);

          postAPI
            .getRelationCategoryPost(
              this.postDetail.categoryCode,
              this.postCode
            )
            .then((res) => {
              this.relationPostList = res.data.postList;
              this.isLoadedRelation = true;
            })
            .catch((err) => {
              console.error("Load popular post list failed ", err);
            });
        })
        .catch((err) => {
          console.error("Load post detail failed ", err);
          // this.$swal({
          //   icon: "error",
          //   title: "Không load được nội dung bài post :(",
          //   timer: 3000,
          //   showConfirmButton: true,
          //   type: "error",
          // });
          this.$router.push({ name: "404" });
        });
    },
    groupLinkDownload(myArray) {
      var groupToValues = myArray.reduce(function (obj, item) {
        obj[item.name] = obj[item.name] || [];
        obj[item.name].push({
          id: item.id,
          typeCode: item.typeCode,
          typeName: item.typeName,
          url: item.url,
        });
        return obj;
      }, {});

      var groups = Object.keys(groupToValues).map(function (key) {
        return { name: key, links: groupToValues[key] };
      });

      return groups;
    },
    increaseReadNum() {
      window.setTimeout(() => {
        postAPI
          .updateReadNum(this.postCode)
          .then(() => { })
          .catch((err) => {
            console.error("Load post detail failed ", err);
          });
      }, 10000);
    },
  },
  watch: {
    "$route.params.postCode"() {
      if (this.$route.params.postCode) {
        this.postCode = this.$route.params.postCode;
        this.loadDetail();
        this.increaseReadNum();
      }
    },
  },
};
</script>

<style lang="scss" src="@/assets/scss/postDetail.scss"></style>
<template>
    <div class="train-workbench">
        <div class="top-user-info">
            <div class="user-info">
              <div style="height: 30px;width: 30px;background: rgb(245, 245, 245);border-radius: 50%;display: flex">
                <i style="margin: auto" class="el-icon-user"></i>
              </div>
                <div style="margin: auto 10px">
                    <div>
                        <span class="main-span-color">{{timeLabel}}，{{user.username}}，</span>
                        <span style="color: #171717;font-size: 14px">{{greetWord}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-workbench">
            <div class="content-left">
              <div class="main-title">代办事项</div>
            </div>
            <div class="content-right">
                <div class="content-right-top">
                    <el-calendar v-model="value">
                    </el-calendar>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Workbench',
  data () {
    return {
      value: new Date(),
      user: JSON.parse(sessionStorage.getItem('user')),
      timeLabel: '', // 时间标志，提示语
      greetWord: '' // 问候语
    }
  },
  mounted () {
    let date = new Date()
    if (date.getHours() > 6 && date.getHours() < 13) {
      this.timeLabel = '早上好'
      this.greetWord = '祝你开心每一天'
    } else if (date.getHours() >= 13 && date.getHours() < 20) {
      this.timeLabel = '下午好'
      this.greetWord = '下午继续努力'
    } else if (date.getHours() >= 20 && date.getHours() < 24) {
      this.timeLabel = '晚上好'
      this.greetWord = '工作一天了，休息休息'
    } else {
      this.timeLabel = '夜已深'
      this.greetWord = '这么晚该睡觉了'
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/stylus/color.styl"
.train-workbench {
    display flex
    flex-direction column
    overflow-y hidden
    .top-user-info {
        height 80px;
        background $color-white
        display flex
        box-shadow: 0 0 5px #e7e8e9;
        border-radius: 4px;
        .user-info{
            margin auto 0
            display flex
            padding 0 10px
            img {
                height 55px
                width 55px
            }
            .org-info{
                font-size: 12px;
                display flex
                color: #797979;
            }
        }
    }
    .bottom-workbench{
        display: flex;
        .content-left{
            flex-grow 1
            flex-shrink 1
            margin 15px 15px 0 0
          box-shadow: 0 0 5px #e7e8e9;
          background $color-white
          border-radius 4px
          padding 10px 15px
          .main-title{
            font-size 16px
            font-weight 600
            margin-bottom 10px
          }
        }
        .content-right{
            width 400px
            margin-top 15px
            box-sizing border-box
            flex-grow 0
            flex-shrink 0
          .el-calendar {
            box-shadow: 0 0 5px #e7e8e9;
            border-radius 5px
            .el-calendar__body {
              padding: 12px 20px 25px;
            }
            .is-selected{
              background-image: linear-gradient(-135deg, #38B8F2 0%, #843CF6 100%);
              color #ffffff
            }
            .el-calendar-table .el-calendar-day {
              height: 50px;
            }
            .el-calendar-day:hover{
              background-image: linear-gradient(-135deg, #38B8F2 0%, #843CF6 100%);
            }
          }
        }
    }
}
</style>

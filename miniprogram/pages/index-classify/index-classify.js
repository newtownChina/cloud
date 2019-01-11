// pages/index-classify/index-classify.js
const app = getApp();
const classifyData = ["全部", "图书音像", "手机", "交通工具", "美妆个护", "艺术文玩", "玩具乐器", "租房", "数码", "服装鞋帽", "运动户外", "电脑", "平板电脑", "办公用品", "家用电器", "珠宝装饰", "技能服务", "其他分类"]
const classifyDetailData={
  all: ["全部"],
  phone: ["苹果", "小米", "华为", "oppo", "vivo", "三星", "魅族", "诺基亚", "努比亚", "锤子", "一加", "HTC", "美图", "索尼", "乐视", "联想", "酷派", "中兴", "摩托罗拉", "LG", "金立", "黑莓", "其他手机品牌", "手机配件"],
  digital: ["摄影器材", "耳机", "mp3/mp4", "游戏机及配件", "游戏软件", "音箱/音响", "移动电源", "智能穿戴", "其他智能设备", "kindle/电子书", "存储设备", "其它数码"],
  clothingAndShoes: ["女装上衣", "女装裤子", "女装裙子", "女装套装", "男装上衣", "男装裤子", "女鞋", "男鞋", "女包", "男宝", "行李箱", "衣帽配饰", "运动鞋服", "其他服装"],
  vehicle:["摩托车", "电动车", "自行车", "平衡车/体感车", "摩托车/电动车配件", "自行车配件", "汽车用品", "汽车配件", "其他代步工具"],
  motherAndBabyArticles: ["婴幼服饰", "童车童床", "玩具图书", "尿裤湿巾", "安全座椅", "奶粉辅食", "喂养用具", "孕妈用品", "洗护用品", "其它母婴用品"],
  houseHoldElectricAppliances:["电视机", "洗衣机", "冰箱", "空调", "热水机", "厨房电器", "生活小家电", "其他家电"],
  homeFurniture:["沙发", "床/床垫", "柜子", "桌子/茶几", "椅子/凳子", "家装软饰", "家纺", "灯具照明", "厨房卫浴", "衣架/柜子", "其他家居家具"],
  computer:["笔记本", "台式机", "电脑配件", "外设产品", "网络设备"],
  tabletPC:["苹果平板", "三星平板", "小米平板", "华为平板", "戴尔平板", "其它分类"],
  toyInstrument:["玩具", "吉他", "钢琴", "电子琴", "古筝", "架子鼓", "小提琴", "二胡", "其它乐器"],
  officeSupplies:["打印机/复印机", "办公家具", "投影仪", "文具耗材", "其他办公用品"],
  onBoardEquipment:["导航仪", "行车记录仪", "倒车雷达", "车载音响", "车载冰箱", "车载吸尘器", "车载香水", "储物箱", "维修保养设备", "其他车载设备"], 
  ticketCard:["健身/美容卡", "储物卡", "赛事演出", "景点门票", "电影票", "其他卡券"],
  jewelryAccessories:["男表", "女表", "珠宝", "其他珠宝饰品"],
  pet:["狗狗用", "猫猫用", "花鸟鱼虫用"],
  outdoorSports:["健身训练", "户外装备", "桌游棋牌", "轮滑", "垂钓用品", "游泳用品", "舞蹈瑜伽", "其他运动用品"],
  bookAndVideo:["图书教材", "唱片影片", "其他图书音像品"],
  artCulture:["邮币票证", "文玩", "珠宝玉器", "书法绘画", "其它艺术文玩"],
  beautyDressing:["护肤", "彩妆", "口腔护理", "洗发护发", "香水", "美容工具", "其它美容用品"],
  rental:["整租", "单间", "短租/日租", "车位", "商铺租售", "厂房/仓库/土地", "其他"],
  skillServer: ["家政护理", "教育培训", "it服务", "语言翻译", "买房装修","宠物美容", "运动健身", "其它"],
  otherClassify: ["求购", "食品", "保健用品", "其它闲置二手"]
}

Page({
  data: {
    classifyArray: classifyData,
    classifyDetail: classifyDetailData.all //进去分类页后首先显示的分类
  },
  showClassifyDetail: function (e) {
    var classifyname = e.currentTarget.dataset.name;
    console.log(e.currentTarget.dataset.name)
    switch (classifyname) {
      case "全部": {
        this.setData({
          classifyDetail: classifyDetailData.all
        })
        break;
      }
      case "手机": {
        this.setData({
          classifyDetail: classifyDetailData.phone
        })
        break;
      }
      case "数码": {
        this.setData({
          classifyDetail: classifyDetailData.digital
        })
        break;
      }
      case "服装鞋帽": {
        this.setData({
          classifyDetail: classifyDetailData.clothingAndShoes
        })
        break;
      }
      case "交通工具": {
        this.setData({
          classifyDetail: classifyDetailData.vehicle
        })
        break;
      }
      case "家用电器": {
        this.setData({
          classifyDetail: classifyDetailData.houseHoldElectricAppliances
        })
        break;
      }
      case "电脑": {
        this.setData({
          classifyDetail: classifyDetailData.computer
        })
        break;
      }
      case "平板电脑": {
        this.setData({
          classifyDetail: classifyDetailData.tabletPC
        })
        break;
      }
      case "玩具乐器": {
        this.setData({
          classifyDetail: classifyDetailData.toyInstrument
        })
        break;
      }
      case "办公用品": {
        this.setData({
          classifyDetail: classifyDetailData.officeSupplies
        })
        break;
      }
      case "珠宝装饰": {
        this.setData({
          classifyDetail: classifyDetailData.jewelryAccessories
        })
        break;
      }
      case "运动户外": {
        this.setData({
          classifyDetail: classifyDetailData.outdoorSports
        })
        break;
      }
      case "图书音像": {
        this.setData({
          classifyDetail: classifyDetailData.bookAndVideo
        })
        break;
      }
      case "艺术文玩": {
        this.setData({
          classifyDetail: classifyDetailData.artCulture
        })
        break;
      }
      case "美妆个护": {
        this.setData({
          classifyDetail: classifyDetailData.beautyDressing
        })
        break;
      }
      case "租房": {
        this.setData({
          classifyDetail: classifyDetailData.rental
        })
        break;
      }
      case "技能服务": {
        this.setData({
          classifyDetail: classifyDetailData.skillServer
        })
        break;
      }
      case "其他分类": {
        this.setData({
          classifyDetail: classifyDetailData.otherClassify
        })
        break;
      }
    }
    console.log(this.data.classifyDetail)
  },
  setClassifyDetailName:function(e){
    console.log("进入index:classifyDetailName")
    var detailName = e.currentTarget.dataset.detailname
    //如果之前查询到数据了，需要将pageNum重置为0，不然新选择的分类pageNum不是从0开始的，也不能直接在index.js的onShow里面直接重置为0，因为这样的话每次用户打开index.js都将会从0开始查询，之前查看的物品位置就会刷新
    if (detailName){//如果用户选择了新分类（用户可能进去后没选择直接返回）
    //先把上次所选分类备份，否则可能新分类无返回数据，不能采取无数据就不变更的方式，因为实际上在你点了新分类之后，indexClassify.detailName已经改变了，这样在你每次打开index的时候都可能会提示“没有相关商品”
      var oldIndexClassify = wx.getStorageSync("indexClassify")
      wx.setStorageSync("oldIndexClassify", oldIndexClassify)
      wx.setStorageSync("indexClassify", { "detailName": detailName,"resetPageNum":0})
      //选择新分类后，要从所选分类结果集第0项开始显示
    }
    console.log(detailName)
    wx.navigateBack({
      delta: 1//返回到前一页，数字表示返回前几页
    })
  }
})
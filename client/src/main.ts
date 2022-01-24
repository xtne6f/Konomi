
import axios from 'axios';
import { Icon, addIcon } from '@iconify/vue2/dist/offline';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VTooltip from 'v-tooltip';
import 'v-tooltip/dist/v-tooltip.css'
import '@mdi/font/css/materialdesignicons.css';
import 'yakuhanjp/dist/css/yakuhanjp_s.css';

import App from '@/App.vue';
import VTabItem from '@/components/VTabItem';
import VTabs from '@/components/VTabs';
import VTabsItems from '@/components/VTabsItems';
import mixin from '@/mixins';
import vuetify from '@/plugins/vuetify';
import router from '@/router';

// 各アイコンのインポート
// ソースで使っているアイコンを列挙するコマンド:
// find -name '*.vue' -exec grep '<Icon ' {} ';' | sed 's/^.*\sicon=\(\S*\).*$/\1/' | sort | uniq

import akarIconsChevronRight from '@iconify/icons-akar-icons/chevron-right';
import biChatLeftTextFill from '@iconify/icons-bi/chat-left-text-fill';
import faBrandsTwitter from '@iconify/icons-fa-brands/twitter';
import faSolidBroadcastTower from '@iconify/icons-fa-solid/broadcast-tower';
import faSolidEye from '@iconify/icons-fa-solid/eye';
import faSolidFireAlt from '@iconify/icons-fa-solid/fire-alt';
import faSolidInfoCircle from '@iconify/icons-fa-solid/info-circle';
import faSolidSlidersH from '@iconify/icons-fa-solid/sliders-h';
import fluentCalendarLtr20Regular from '@iconify/icons-fluent/calendar-ltr-20-regular';
import fluentFastForward20Filled from '@iconify/icons-fluent/fast-forward-20-filled';
import fluentHistory16Regular from '@iconify/icons-fluent/history-16-regular';
import fluentImageMultiple24Regular from '@iconify/icons-fluent/image-multiple-24-regular';
import fluentInfo16Regular from '@iconify/icons-fluent/info-16-regular';
import fluentIosArrowLeft24Filled from '@iconify/icons-fluent/ios-arrow-left-24-filled';
import fluentIosArrowRight24Filled from '@iconify/icons-fluent/ios-arrow-right-24-filled';
import fluentMoviesAndTv20Regular from '@iconify/icons-fluent/movies-and-tv-20-regular';
import fluentNavigation16Filled from '@iconify/icons-fluent/navigation-16-filled';
import fluentPerson20Filled from '@iconify/icons-fluent/person-20-filled';
import fluentPin20Filled from '@iconify/icons-fluent/pin-20-filled';
import fluentSettings20Regular from '@iconify/icons-fluent/settings-20-regular';
import fluentTv20Regular from '@iconify/icons-fluent/tv-20-regular';
import heroiconsSolidFilter from '@iconify/icons-heroicons-solid/filter';
import icRoundPlaylistPlay from '@iconify/icons-ic/round-playlist-play';

// 各アイコンをフレームワークに登録
addIcon('akar-icons:chevron-right', akarIconsChevronRight);
addIcon('bi:chat-left-text-fill', biChatLeftTextFill);
addIcon('fa-brands:twitter', faBrandsTwitter);
addIcon('fa-solid:broadcast-tower', faSolidBroadcastTower);
addIcon('fa-solid:eye', faSolidEye);
addIcon('fa-solid:fire-alt', faSolidFireAlt);
addIcon('fa-solid:info-circle', faSolidInfoCircle);
addIcon('fa-solid:sliders-h', faSolidSlidersH);
addIcon('fluent:calendar-ltr-20-regular', fluentCalendarLtr20Regular);
addIcon('fluent:fast-forward-20-filled', fluentFastForward20Filled);
addIcon('fluent:history-16-regular', fluentHistory16Regular);
addIcon('fluent:image-multiple-24-regular', fluentImageMultiple24Regular);
addIcon('fluent:info-16-regular', fluentInfo16Regular);
addIcon('fluent:ios-arrow-left-24-filled', fluentIosArrowLeft24Filled);
addIcon('fluent:ios-arrow-right-24-filled', fluentIosArrowRight24Filled);
addIcon('fluent:movies-and-tv-20-regular', fluentMoviesAndTv20Regular);
addIcon('fluent:navigation-16-filled', fluentNavigation16Filled);
addIcon('fluent:person-20-filled', fluentPerson20Filled);
addIcon('fluent:pin-20-filled', fluentPin20Filled);
addIcon('fluent:settings-20-regular', fluentSettings20Regular);
addIcon('fluent:tv-20-regular', fluentTv20Regular);
addIcon('heroicons-solid:filter', heroiconsSolidFilter);
addIcon('ic:round-playlist-play', icRoundPlaylistPlay);

// Production Tip を非表示に
Vue.config.productionTip = false;

// Axios を使う
Vue.use(VueAxios, axios);

// vue-virtual-scroller を使う
Vue.use(VueVirtualScroller)

// VTooltip を使う
// タッチデバイスでは無効化する
// ref: https://v-tooltip.netlify.app/guide/config.html#default-values
const trigger = window.matchMedia('(hover: none)').matches ? [] : ['hover', 'focus', 'touch'];
VTooltip.options.themes.tooltip.showTriggers = trigger;
VTooltip.options.themes.tooltip.hideTriggers = trigger;
VTooltip.options.themes.tooltip.delay.show = 0;
VTooltip.options.offset = [0, 7];
Vue.use(VTooltip);

// Iconify（アイコン）のグローバルコンポーネント
Vue.component('Icon', Icon);

// VTabItem の挙動を改善するグローバルコンポーネント
Vue.component('v-tab-item-fix', VTabItem);

// VTabs の挙動を改善するグローバルコンポーネント
Vue.component('v-tabs-fix', VTabs);

// VTabsItems の挙動を改善するグローバルコンポーネント
Vue.component('v-tabs-items-fix', VTabsItems);

// グローバル Mixin を登録
Vue.mixin(mixin);

// Vue を初期化
new Vue({
    router,
    vuetify,
    render: h => h(App),
}).$mount('#app');

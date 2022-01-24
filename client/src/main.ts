
import { Icon, addIcon } from '@iconify/vue2/dist/offline';
import { polyfill as SeamlessScrollPolyfill } from "seamless-scroll-polyfill";
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import VuetifyMessageSnackbar from 'vuetify-message-snackbar';
import VTooltip from 'v-tooltip';
import 'v-tooltip/dist/v-tooltip.css';
import '@mdi/font/css/materialdesignicons.css';
import 'yakuhanjp/dist/css/yakuhanjp_s.css';

import App from '@/App.vue';
import VTabItem from '@/components/VTabItem';
import VTabs from '@/components/VTabs';
import VTabsItems from '@/components/VTabsItems';
import axios from '@/plugins/axios';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import '@/service-worker';
import Utils from './utils';

// スムーズスクロール周りの API の polyfill を適用
// Element.scrollInfoView() のオプション指定を使うために必要
SeamlessScrollPolyfill();

// 各アイコンのインポート
// ソースで使っているアイコンを列挙するコマンド:
// find -name '*.vue' -exec grep '<Icon ' {} ';' | sed 's/^.*\sicon=\(\S*\).*$/\1/' | sort | uniq

import akarIconsChevronRight from '@iconify/icons-akar-icons/chevron-right';
import biChatLeftTextFill from '@iconify/icons-bi/chat-left-text-fill';
import charmHash from '@iconify/icons-charm/hash';
import faSignIn from '@iconify/icons-fa/sign-in';
import faSignOut from '@iconify/icons-fa/sign-out';
import faBrandsTwitter from '@iconify/icons-fa-brands/twitter';
import faSolidBroadcastTower from '@iconify/icons-fa-solid/broadcast-tower';
import faSolidEye from '@iconify/icons-fa-solid/eye';
import faSolidFireAlt from '@iconify/icons-fa-solid/fire-alt';
import faSolidInfoCircle from '@iconify/icons-fa-solid/info-circle';
import faSolidSlidersH from '@iconify/icons-fa-solid/sliders-h';
import fa6SolidDownload from '@iconify/icons-fa6-solid/download';
import fa6SolidUpload from '@iconify/icons-fa6-solid/upload';
import fluentAdd12Filled from '@iconify/icons-fluent/add-12-filled';
import fluentArrowDown12Filled from '@iconify/icons-fluent/arrow-down-12-filled';
import fluentArrowLeft12Filled from '@iconify/icons-fluent/arrow-left-12-filled';
import fluentArrowSync20Filled from '@iconify/icons-fluent/arrow-sync-20-filled';
import fluentCalendarLtr20Regular from '@iconify/icons-fluent/calendar-ltr-20-regular';
import fluentCheckmark16Filled from '@iconify/icons-fluent/checkmark-16-filled';
import fluentCheckmarkCircle16Filled from '@iconify/icons-fluent/checkmark-circle-16-filled';
import fluentClipboardTextLtr32Regular from '@iconify/icons-fluent/clipboard-text-ltr-32-regular';
import fluentCommentDismiss20Filled from '@iconify/icons-fluent/comment-dismiss-20-filled';
import fluentDelete16Filled from '@iconify/icons-fluent/delete-16-filled';
import fluentDismiss12Filled from '@iconify/icons-fluent/dismiss-12-filled';
import fluentDismiss16Filled from '@iconify/icons-fluent/dismiss-16-filled';
import fluentDocumentArrowDown16Filled from '@iconify/icons-fluent/document-arrow-down-16-filled';
import fluentDocumentArrowUp16Filled from '@iconify/icons-fluent/document-arrow-up-16-filled';
import fluentEdit16Filled from '@iconify/icons-fluent/edit-16-filled';
import fluentFastForward20Filled from '@iconify/icons-fluent/fast-forward-20-filled';
import fluentHistory16Regular from '@iconify/icons-fluent/history-16-regular';
import fluentHome16Regular from '@iconify/icons-fluent/home-16-regular';
import fluentImage16Filled from '@iconify/icons-fluent/image-16-filled';
import fluentImageCopy20Regular from '@iconify/icons-fluent/image-copy-20-regular';
import fluentImageMultiple24Regular from '@iconify/icons-fluent/image-multiple-24-regular';
import fluentInfo16Regular from '@iconify/icons-fluent/info-16-regular';
import fluentIosArrowLeft24Filled from '@iconify/icons-fluent/ios-arrow-left-24-filled';
import fluentIosArrowRight24Filled from '@iconify/icons-fluent/ios-arrow-right-24-filled';
import fluentKeyboard20Filled from '@iconify/icons-fluent/keyboard-20-filled';
import fluentMoreCircle20Regular from '@iconify/icons-fluent/more-circle-20-regular';
import fluentMoreVertical20Filled from '@iconify/icons-fluent/more-vertical-20-filled';
import fluentMoviesAndTv20Regular from '@iconify/icons-fluent/movies-and-tv-20-regular';
import fluentNavigation16Filled from '@iconify/icons-fluent/navigation-16-filled';
import fluentPerson20Filled from '@iconify/icons-fluent/person-20-filled';
import fluentPersonAdd20Filled from '@iconify/icons-fluent/person-add-20-filled';
import fluentPersonBoard20Filled from '@iconify/icons-fluent/person-board-20-filled';
import fluentPersonProhibited20Filled from '@iconify/icons-fluent/person-prohibited-20-filled';
import fluentPin20Filled from '@iconify/icons-fluent/pin-20-filled';
import fluentPlugConnected20Filled from '@iconify/icons-fluent/plug-connected-20-filled';
import fluentPlugDisconnected20Filled from '@iconify/icons-fluent/plug-disconnected-20-filled';
import fluentSave16Filled from '@iconify/icons-fluent/save-16-filled';
import fluentSearch16Filled from '@iconify/icons-fluent/search-16-filled';
import fluentSettings20Regular from '@iconify/icons-fluent/settings-20-regular';
import fluentToolbox20Filled from '@iconify/icons-fluent/toolbox-20-filled';
import fluentTv20Regular from '@iconify/icons-fluent/tv-20-regular';
import fluentZoomIn16Regular from '@iconify/icons-fluent/zoom-in-16-regular';
import heroiconsSolidFilter from '@iconify/icons-heroicons-solid/filter';
import icRoundPlaylistPlay from '@iconify/icons-ic/round-playlist-play';
import materialSymbolsDragHandleRounded from '@iconify/icons-material-symbols/drag-handle-rounded';

// 各アイコンをフレームワークに登録
// sed -n "s/^import \\(.*\\) from '@iconify\\/icons-\\([^/]*\\)\\/\\([^/]*\\)';$/addIcon('\\2:\\3', \\1);/p" main.ts
addIcon('akar-icons:chevron-right', akarIconsChevronRight);
addIcon('bi:chat-left-text-fill', biChatLeftTextFill);
addIcon('charm:hash', charmHash);
addIcon('fa:sign-in', faSignIn);
addIcon('fa:sign-out', faSignOut);
addIcon('fa-brands:twitter', faBrandsTwitter);
addIcon('fa-solid:broadcast-tower', faSolidBroadcastTower);
addIcon('fa-solid:eye', faSolidEye);
addIcon('fa-solid:fire-alt', faSolidFireAlt);
addIcon('fa-solid:info-circle', faSolidInfoCircle);
addIcon('fa-solid:sliders-h', faSolidSlidersH);
addIcon('fa6-solid:download', fa6SolidDownload);
addIcon('fa6-solid:upload', fa6SolidUpload);
addIcon('fluent:add-12-filled', fluentAdd12Filled);
addIcon('fluent:arrow-down-12-filled', fluentArrowDown12Filled);
addIcon('fluent:arrow-left-12-filled', fluentArrowLeft12Filled);
addIcon('fluent:arrow-sync-20-filled', fluentArrowSync20Filled);
addIcon('fluent:calendar-ltr-20-regular', fluentCalendarLtr20Regular);
addIcon('fluent:checkmark-16-filled', fluentCheckmark16Filled);
addIcon('fluent:checkmark-circle-16-filled', fluentCheckmarkCircle16Filled);
addIcon('fluent:clipboard-text-ltr-32-regular', fluentClipboardTextLtr32Regular);
addIcon('fluent:comment-dismiss-20-filled', fluentCommentDismiss20Filled);
addIcon('fluent:delete-16-filled', fluentDelete16Filled);
addIcon('fluent:dismiss-12-filled', fluentDismiss12Filled);
addIcon('fluent:dismiss-16-filled', fluentDismiss16Filled);
addIcon('fluent:document-arrow-down-16-filled', fluentDocumentArrowDown16Filled);
addIcon('fluent:document-arrow-up-16-filled', fluentDocumentArrowUp16Filled);
addIcon('fluent:edit-16-filled', fluentEdit16Filled);
addIcon('fluent:fast-forward-20-filled', fluentFastForward20Filled);
addIcon('fluent:history-16-regular', fluentHistory16Regular);
addIcon('fluent:home-16-regular', fluentHome16Regular);
addIcon('fluent:image-16-filled', fluentImage16Filled);
addIcon('fluent:image-copy-20-regular', fluentImageCopy20Regular);
addIcon('fluent:image-multiple-24-regular', fluentImageMultiple24Regular);
addIcon('fluent:info-16-regular', fluentInfo16Regular);
addIcon('fluent:ios-arrow-left-24-filled', fluentIosArrowLeft24Filled);
addIcon('fluent:ios-arrow-right-24-filled', fluentIosArrowRight24Filled);
addIcon('fluent:keyboard-20-filled', fluentKeyboard20Filled);
addIcon('fluent:more-circle-20-regular', fluentMoreCircle20Regular);
addIcon('fluent:more-vertical-20-filled', fluentMoreVertical20Filled);
addIcon('fluent:movies-and-tv-20-regular', fluentMoviesAndTv20Regular);
addIcon('fluent:navigation-16-filled', fluentNavigation16Filled);
addIcon('fluent:person-20-filled', fluentPerson20Filled);
addIcon('fluent:person-add-20-filled', fluentPersonAdd20Filled);
addIcon('fluent:person-board-20-filled', fluentPersonBoard20Filled);
addIcon('fluent:person-prohibited-20-filled', fluentPersonProhibited20Filled);
addIcon('fluent:pin-20-filled', fluentPin20Filled);
addIcon('fluent:plug-connected-20-filled', fluentPlugConnected20Filled);
addIcon('fluent:plug-disconnected-20-filled', fluentPlugDisconnected20Filled);
addIcon('fluent:save-16-filled', fluentSave16Filled);
addIcon('fluent:search-16-filled', fluentSearch16Filled);
addIcon('fluent:settings-20-regular', fluentSettings20Regular);
addIcon('fluent:toolbox-20-filled', fluentToolbox20Filled);
addIcon('fluent:tv-20-regular', fluentTv20Regular);
addIcon('fluent:zoom-in-16-regular', fluentZoomIn16Regular);
addIcon('heroicons-solid:filter', heroiconsSolidFilter);
addIcon('ic:round-playlist-play', icRoundPlaylistPlay);
addIcon('material-symbols:drag-handle-rounded', materialSymbolsDragHandleRounded);

// Production Tip を非表示にする
Vue.config.productionTip = false;

// 常に Vue.js devtools を有効にする
Vue.config.devtools = true;

// Axios を使う
Vue.use(VueAxios, axios);

// vue-virtual-scroller を使う
Vue.use(VueVirtualScroller);

// vuetify-message-snackbar を使う
// マイナーな OSS（しかも中国語…）だけど、Snackbar を関数で呼びたかったのでちょうどよかった
// ref: https://github.com/thinkupp/vuetify-message-snackbar
Vue.use(VuetifyMessageSnackbar, {
    // 画面上に配置しない
    top: false,
    // 画面下に配置する
    bottom: true,
    // デフォルトの背景色
    color: '#433532',
    // ダークテーマを適用する
    dark: true,
    // 影 (Elevation) の設定
    elevation: 8,
    // 2.5秒でタイムアウト
    timeout: 2500,
    // 要素が非表示になった後に DOM から要素を削除する
	autoRemove: true,
    // 閉じるボタンのテキスト
	closeButtonContent: '閉じる',
	// Vuetify のインスタンス
	vuetifyInstance: vuetify,
});

// VTooltip を使う
// タッチデバイスでは無効化する
// ref: https://v-tooltip.netlify.app/guide/config.html#default-values
const trigger = Utils.isTouchDevice() ? [] : ['hover', 'focus', 'touch'];
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

// Vue を初期化
new Vue({
    router,
    vuetify,
    render: h => h(App),
}).$mount('#app');

// ログイン時かつ設定の同期が有効なとき、ページ遷移に関わらず、常に3秒おきにサーバーから設定を取得する
// 初回のページレンダリングに間に合わないのは想定内（同期の完了を待つこともできるが、それだと表示速度が遅くなるのでしょうがない）
window.setInterval(async () => {
    if (Utils.getAccessToken() !== null && Utils.getSettingsItem('sync_settings') === true) {
        Utils.syncServerSettingsToClient();
    }
}, 3 * 1000);  // 3秒おき

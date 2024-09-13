
// 各アイコンのインポート
// ソースで使っているアイコンを列挙するコマンド:
// find -name '*.vue' -exec grep '<Icon ' {} ';' | sed 's/^.*\sicon=\(\S*\).*$/\1/' | sort | uniq
import akarIconsChevronRight from '@iconify-icons/akar-icons/chevron-right';
import biChatLeftTextFill from '@iconify-icons/bi/chat-left-text-fill';
import charmHash from '@iconify-icons/charm/hash';
import faSignIn from '@iconify-icons/fa/sign-in';
import faSignOut from '@iconify-icons/fa/sign-out';
import faBrandsTwitter from '@iconify-icons/fa-brands/twitter';
import faSolidBroadcastTower from '@iconify-icons/fa-solid/broadcast-tower';
import faSolidEye from '@iconify-icons/fa-solid/eye';
import faSolidFireAlt from '@iconify-icons/fa-solid/fire-alt';
import faSolidInfoCircle from '@iconify-icons/fa-solid/info-circle';
import faSolidSlidersH from '@iconify-icons/fa-solid/sliders-h';
import fa6SolidDownload from '@iconify-icons/fa6-solid/download';
import fa6SolidUpload from '@iconify-icons/fa6-solid/upload';
import fluentAdd12Filled from '@iconify-icons/fluent/add-12-filled';
import fluentArrowCounterclockwise20Filled from '@iconify-icons/fluent/arrow-counterclockwise-20-filled';
import fluentArrowDown12Filled from '@iconify-icons/fluent/arrow-down-12-filled';
import fluentArrowLeft12Filled from '@iconify-icons/fluent/arrow-left-12-filled';
import fluentArrowSync20Filled from '@iconify-icons/fluent/arrow-sync-20-filled';
import fluentCalendar20Regular from '@iconify-icons/fluent/calendar-20-regular';
import fluentCalendarLtr20Regular from '@iconify-icons/fluent/calendar-ltr-20-regular';
import fluentChevronDown12Filled from '@iconify-icons/fluent/chevron-down-12-filled';
import fluentChevronDown20Filled from '@iconify-icons/fluent/chevron-down-20-filled';
import fluentChevronLeft12Filled from '@iconify-icons/fluent/chevron-left-12-filled';
import fluentChevronRight12Filled from '@iconify-icons/fluent/chevron-right-12-filled';
import fluentChevronUp12Filled from '@iconify-icons/fluent/chevron-up-12-filled';
import fluentChevronUp20Filled from '@iconify-icons/fluent/chevron-up-20-filled';
import fluentClipboardPaste20Filled from '@iconify-icons/fluent/clipboard-paste-20-filled';
import fluentClipboardTextLtr32Regular from '@iconify-icons/fluent/clipboard-text-ltr-32-regular';
import fluentCommentDismiss20Filled from '@iconify-icons/fluent/comment-dismiss-20-filled';
import fluentCrop20Filled from '@iconify-icons/fluent/crop-20-filled';
import fluentDelete16Filled from '@iconify-icons/fluent/delete-16-filled';
import fluentDismiss12Filled from '@iconify-icons/fluent/dismiss-12-filled';
import fluentDismiss16Filled from '@iconify-icons/fluent/dismiss-16-filled';
import fluentDismiss20Filled from '@iconify-icons/fluent/dismiss-20-filled';
import fluentDocumentArrowDown16Filled from '@iconify-icons/fluent/document-arrow-down-16-filled';
import fluentDocumentArrowUp16Filled from '@iconify-icons/fluent/document-arrow-up-16-filled';
import fluentFastForward20Filled from '@iconify-icons/fluent/fast-forward-20-filled';
import fluentHistory20Regular from '@iconify-icons/fluent/history-20-regular';
import fluentHome16Filled from '@iconify-icons/fluent/home-16-filled';
import fluentHome16Regular from '@iconify-icons/fluent/home-16-regular';
import fluentImage16Filled from '@iconify-icons/fluent/image-16-filled';
import fluentImageCopy20Regular from '@iconify-icons/fluent/image-copy-20-regular';
import fluentImageMultiple16Filled from '@iconify-icons/fluent/image-multiple-16-filled';
import fluentImageMultiple24Regular from '@iconify-icons/fluent/image-multiple-24-regular';
import fluentInfo16Regular from '@iconify-icons/fluent/info-16-regular';
import fluentInfo20Regular from '@iconify-icons/fluent/info-20-regular';
import fluentIosArrowLeft24Filled from '@iconify-icons/fluent/ios-arrow-left-24-filled';
import fluentIosArrowRight24Filled from '@iconify-icons/fluent/ios-arrow-right-24-filled';
import fluentKeyboard20Filled from '@iconify-icons/fluent/keyboard-20-filled';
import fluentMoreCircle20Regular from '@iconify-icons/fluent/more-circle-20-regular';
import fluentMoviesAndTv20Filled from '@iconify-icons/fluent/movies-and-tv-20-filled';
import fluentMoviesAndTv20Regular from '@iconify-icons/fluent/movies-and-tv-20-regular';
import fluentNavigation16Filled from '@iconify-icons/fluent/navigation-16-filled';
import fluentPerson20Filled from '@iconify-icons/fluent/person-20-filled';
import fluentPerson20Regular from '@iconify-icons/fluent/person-20-regular';
import fluentPersonAdd20Filled from '@iconify-icons/fluent/person-add-20-filled';
import fluentPersonBoard20Filled from '@iconify-icons/fluent/person-board-20-filled';
import fluentPersonProhibited20Filled from '@iconify-icons/fluent/person-prohibited-20-filled';
import fluentPin20Filled from '@iconify-icons/fluent/pin-20-filled';
import fluentPlugConnected20Filled from '@iconify-icons/fluent/plug-connected-20-filled';
import fluentPlugDisconnected20Filled from '@iconify-icons/fluent/plug-disconnected-20-filled';
import fluentPower20Filled from '@iconify-icons/fluent/power-20-filled';
import fluentSave16Filled from '@iconify-icons/fluent/save-16-filled';
import fluentSearch16Filled from '@iconify-icons/fluent/search-16-filled';
import fluentSearch20Filled from '@iconify-icons/fluent/search-20-filled';
import fluentServerSurface16Filled from '@iconify-icons/fluent/server-surface-16-filled';
import fluentSettings16Filled from '@iconify-icons/fluent/settings-16-filled';
import fluentSettings20Regular from '@iconify-icons/fluent/settings-20-regular';
import fluentSubtitles16Filled from '@iconify-icons/fluent/subtitles-16-filled';
import fluentTimer16Regular from '@iconify-icons/fluent/timer-16-regular';
import fluentTv20Filled from '@iconify-icons/fluent/tv-20-filled';
import fluentTv20Regular from '@iconify-icons/fluent/tv-20-regular';
import fluentVideoClipMultiple16Filled from '@iconify-icons/fluent/video-clip-multiple-16-filled';
// おそらく新しすぎてパッケージ化されていないため
//import fluentWrenchSettings20Filled from '@iconify-icons/fluent/wrench-settings-20-filled';
import heroiconsSolidFilter from '@iconify-icons/heroicons-solid/filter';
import icRoundDateRange from '@iconify-icons/ic/round-date-range';
import icRoundPlaylistPlay from '@iconify-icons/ic/round-playlist-play';
import icRoundRefresh from '@iconify-icons/ic/round-refresh';
import iconamoonSortingLeftBold from '@iconify-icons/iconamoon/sorting-left-bold';
import iconoirDatabaseBackup from '@iconify-icons/iconoir/database-backup';
import materialSymbolsDeviceResetRounded from '@iconify-icons/material-symbols/device-reset-rounded';
import materialSymbolsInstallDesktopRounded from '@iconify-icons/material-symbols/install-desktop-rounded';
import materialSymbolsRemoteGen from '@iconify-icons/material-symbols/remote-gen';
import mdiArrowLeftRight from '@iconify-icons/mdi/arrow-left-right';
import mdiArrowUpDown from '@iconify-icons/mdi/arrow-up-down';
import mdiMagnify from '@iconify-icons/mdi/magnify';
import { Icon, addIcon } from '@iconify/vue/offline';
import 'floating-vue/dist/style.css';
import { diff } from 'ohash';
import { createPinia } from 'pinia';
import { polyfill as SeamlessScrollPolyfill } from 'seamless-scroll-polyfill';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { createApp } from 'vue';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import App from '@/App.vue';
import Message from '@/message';
import FloatingVue from '@/plugins/floating-vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import useSettingsStore, {
    getLocalStorageSettings,
    getNormalizedLocalClientSettings,
    hashClientSettings,
    setLocalStorageSettings,
} from '@/stores/SettingsStore';
import Utils from '@/utils';


// スムーズスクロール周りの API の polyfill を適用
// Element.scrollInfoView() のオプション指定を使うために必要
SeamlessScrollPolyfill();

// 各アイコンをフレームワークに登録
// sed -n "s/^import \\(.*\\) from '@iconify-icons\\/\\([^/]*\\)\\/\\([^/]*\\)';$/addIcon('\\2:\\3', \\1);/p" main.ts
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
addIcon('fluent:arrow-counterclockwise-20-filled', fluentArrowCounterclockwise20Filled);
addIcon('fluent:arrow-down-12-filled', fluentArrowDown12Filled);
addIcon('fluent:arrow-left-12-filled', fluentArrowLeft12Filled);
addIcon('fluent:arrow-sync-20-filled', fluentArrowSync20Filled);
addIcon('fluent:calendar-20-regular', fluentCalendar20Regular);
addIcon('fluent:calendar-ltr-20-regular', fluentCalendarLtr20Regular);
addIcon('fluent:chevron-down-12-filled', fluentChevronDown12Filled);
addIcon('fluent:chevron-down-20-filled', fluentChevronDown20Filled);
addIcon('fluent:chevron-left-12-filled', fluentChevronLeft12Filled);
addIcon('fluent:chevron-right-12-filled', fluentChevronRight12Filled);
addIcon('fluent:chevron-up-12-filled', fluentChevronUp12Filled);
addIcon('fluent:chevron-up-20-filled', fluentChevronUp20Filled);
addIcon('fluent:clipboard-paste-20-filled', fluentClipboardPaste20Filled);
addIcon('fluent:clipboard-text-ltr-32-regular', fluentClipboardTextLtr32Regular);
addIcon('fluent:comment-dismiss-20-filled', fluentCommentDismiss20Filled);
addIcon('fluent:crop-20-filled', fluentCrop20Filled);
addIcon('fluent:delete-16-filled', fluentDelete16Filled);
addIcon('fluent:dismiss-12-filled', fluentDismiss12Filled);
addIcon('fluent:dismiss-16-filled', fluentDismiss16Filled);
addIcon('fluent:dismiss-20-filled', fluentDismiss20Filled);
addIcon('fluent:document-arrow-down-16-filled', fluentDocumentArrowDown16Filled);
addIcon('fluent:document-arrow-up-16-filled', fluentDocumentArrowUp16Filled);
addIcon('fluent:fast-forward-20-filled', fluentFastForward20Filled);
addIcon('fluent:history-20-regular', fluentHistory20Regular);
addIcon('fluent:home-16-filled', fluentHome16Filled);
addIcon('fluent:home-16-regular', fluentHome16Regular);
addIcon('fluent:image-16-filled', fluentImage16Filled);
addIcon('fluent:image-copy-20-regular', fluentImageCopy20Regular);
addIcon('fluent:image-multiple-16-filled', fluentImageMultiple16Filled);
addIcon('fluent:image-multiple-24-regular', fluentImageMultiple24Regular);
addIcon('fluent:info-16-regular', fluentInfo16Regular);
addIcon('fluent:info-20-regular', fluentInfo20Regular);
addIcon('fluent:ios-arrow-left-24-filled', fluentIosArrowLeft24Filled);
addIcon('fluent:ios-arrow-right-24-filled', fluentIosArrowRight24Filled);
addIcon('fluent:keyboard-20-filled', fluentKeyboard20Filled);
addIcon('fluent:more-circle-20-regular', fluentMoreCircle20Regular);
addIcon('fluent:movies-and-tv-20-filled', fluentMoviesAndTv20Filled);
addIcon('fluent:movies-and-tv-20-regular', fluentMoviesAndTv20Regular);
addIcon('fluent:navigation-16-filled', fluentNavigation16Filled);
addIcon('fluent:person-20-filled', fluentPerson20Filled);
addIcon('fluent:person-20-regular', fluentPerson20Regular);
addIcon('fluent:person-add-20-filled', fluentPersonAdd20Filled);
addIcon('fluent:person-board-20-filled', fluentPersonBoard20Filled);
addIcon('fluent:person-prohibited-20-filled', fluentPersonProhibited20Filled);
addIcon('fluent:pin-20-filled', fluentPin20Filled);
addIcon('fluent:plug-connected-20-filled', fluentPlugConnected20Filled);
addIcon('fluent:plug-disconnected-20-filled', fluentPlugDisconnected20Filled);
addIcon('fluent:power-20-filled', fluentPower20Filled);
addIcon('fluent:save-16-filled', fluentSave16Filled);
addIcon('fluent:search-16-filled', fluentSearch16Filled);
addIcon('fluent:search-20-filled', fluentSearch20Filled);
addIcon('fluent:server-surface-16-filled', fluentServerSurface16Filled);
addIcon('fluent:settings-16-filled', fluentSettings16Filled);
addIcon('fluent:settings-20-regular', fluentSettings20Regular);
addIcon('fluent:subtitles-16-filled', fluentSubtitles16Filled);
addIcon('fluent:timer-16-regular', fluentTimer16Regular);
addIcon('fluent:tv-20-filled', fluentTv20Filled);
addIcon('fluent:tv-20-regular', fluentTv20Regular);
addIcon('fluent:video-clip-multiple-16-filled', fluentVideoClipMultiple16Filled);
// おそらく新しすぎてパッケージ化されていないため
addIcon('fluent:wrench-settings-20-filled', {
    width: 20,
    height: 20,
    body: "<path fill=\"currentColor\" d=\"M13.5 2a4.5 4.5 0 0 0-4.417 5.36l-6.426 6.658a2.357 2.357 0 0 0 3.374 3.293L9.004 14.3a5.5 5.5 0 0 1 7.833-4.78a4.51 4.51 0 0 0 1.05-4.03a.5.5 0 0 0-.841-.242L14.5 7.793L12.208 5.5l2.545-2.545a.5.5 0 0 0-.242-.84A4.5 4.5 0 0 0 13.501 2m-2.865 11.92a2 2 0 0 0 1.43-2.478l-.155-.557q.382-.293.821-.497l.338.358a2 2 0 0 0 2.91.001l.324-.344q.448.212.835.519l-.126.422a2 2 0 0 0 1.456 2.519l.349.082a4.7 4.7 0 0 1 .01 1.017l-.46.118a2 2 0 0 0-1.431 2.478l.156.556q-.383.295-.822.498l-.338-.358a2 2 0 0 0-2.909-.002l-.325.345a4.3 4.3 0 0 1-.835-.518l.127-.423a2 2 0 0 0-1.456-2.52l-.35-.082a4.7 4.7 0 0 1-.01-1.016zm2.865.58a1 1 0 1 0 2 0a1 1 0 0 0-2 0\" />"
});
addIcon('heroicons-solid:filter', heroiconsSolidFilter);
addIcon('ic:round-date-range', icRoundDateRange);
addIcon('ic:round-playlist-play', icRoundPlaylistPlay);
addIcon('ic:round-refresh', icRoundRefresh);
addIcon('iconamoon:sorting-left-bold', iconamoonSortingLeftBold);
addIcon('iconoir:database-backup', iconoirDatabaseBackup);
addIcon('material-symbols:device-reset-rounded', materialSymbolsDeviceResetRounded);
addIcon('material-symbols:install-desktop-rounded', materialSymbolsInstallDesktopRounded);
addIcon('material-symbols:remote-gen', materialSymbolsRemoteGen);
addIcon('mdi:arrow-left-right', mdiArrowLeftRight);
addIcon('mdi:arrow-up-down', mdiArrowUpDown);
addIcon('mdi:magnify', mdiMagnify);

// ***** Vue アプリケーションの初期化 *****

// Vue アプリケーションを作成
const app = createApp(App);

// Pinia を使う
// ref: https://pinia.vuejs.org/cookbook/options-api.html
app.use(createPinia());

// Iconify (アイコン) のグローバルコンポーネントを登録
app.component('Icon', Icon);

// Vue Router を使う
app.use(router);

// Vuetify を使う
app.use(vuetify);

// vue-virtual-scroller を使う
app.use(VueVirtualScroller);

// FloatingVue を使う
// タッチデバイスでは無効化する
// ref: https://v-tooltip.netlify.app/guide/config#default-values
FloatingVue.options.themes.tooltip.triggers = Utils.isTouchDevice() ? [] : ['hover', 'focus', 'touch'];
FloatingVue.options.themes.tooltip.delay.show = 0;
FloatingVue.options.offset = [0, 7];
app.use(FloatingVue);

// マウントを実行
app.mount('#app');

// ***** Service Worker のイベントを登録 *****

const { updateServiceWorker } = useRegisterSW({
    // Service Worker の登録に成功したとき
    onRegisteredSW(registration) {
        console.log('Service worker has been registered.');
    },
    // Service Worker の登録に失敗したとき
    onRegisterError(error) {
        console.error('Error during service worker registration:', error);
    },
    // PWA がオフラインで利用可能になったとき
    onOfflineReady() {
        console.log('Content has been cached for offline use.');
    },
    // PWA の更新が必要なとき
    async onNeedRefresh() {
        console.log('New content is available; please refresh.');
        // リロードするまでトーストを表示し続ける
        Message.show('クライアントが新しいバージョンに更新されました。5秒後にリロードします。', 10);  // 10秒間表示
        await Utils.sleep(5);  // 5秒待つ
        // PWA (Service Worker) を更新し、ページをリロードする
        updateServiceWorker(true);
    },
});

// ***** 設定データの同期 *****

// 設定データの変更を監視する
// Pinia の $subscribe() は app.mount() の後に呼び出す必要がある
const settings_store = useSettingsStore();
settings_store.$subscribe(async () => {

    // 現在 LocalStorage に保存されている設定データを取得
    const current_saved_settings = getNormalizedLocalClientSettings(getLocalStorageSettings());

    // 設定データが変更されている場合は、サーバーにアップロードする
    if (hashClientSettings(current_saved_settings) !== hashClientSettings(settings_store.settings)) {

        // 設定データを LocalStorage に保存
        console.trace('Client Settings Changed:', diff(current_saved_settings, settings_store.settings));
        setLocalStorageSettings(settings_store.settings);

        // このクライアントの設定をサーバーに同期する (ログイン時かつ同期が有効な場合のみ実行される)
        await settings_store.syncClientSettingsToServer();

    // 設定データが変更されているが更新されたキーが last_synced_at だけの場合は、LocalStorage への保存のみ行う
    // hashClientSettings() は last_synced_at への変更を除外してハッシュ化を行う
    } else if (current_saved_settings.last_synced_at < settings_store.settings.last_synced_at) {

        // 設定データを LocalStorage に保存
        setLocalStorageSettings(settings_store.settings);
    }

}, {detached: true});

// ログイン時かつ設定の同期が有効な場合、ページ遷移に関わらず、常に3秒おきにサーバーから設定を取得する
// 初回のページレンダリングに間に合わないのは想定内（同期の完了を待つこともできるが、それだと表示速度が遅くなるのでしょうがない）
window.setInterval(async () => {
    if (Utils.getAccessToken() !== null && settings_store.settings.sync_settings === true) {

        // サーバーに保存されている設定データをこのクライアントに同期する
        await settings_store.syncClientSettingsFromServer();
    }
}, 3 * 1000);  // 3秒おき

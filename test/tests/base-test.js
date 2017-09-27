class BaseTest {

    constructor(params, page) {

        let pageExtensions = {
            _waitForVisible: async function (selector, opts) {
                console.log('Waiting for: ' + selector);
                opts = Object.assign({}, opts, {visible: true});
                return this.waitForSelector(selector, opts);
            },

            _waitForVisibleAndClick: async function (selector, opts) {
                await this._waitForVisible(selector, opts);
                return this.click(selector);
            }
        };

        this.params = params;
        this.page = Object.assign(page, pageExtensions);
    }

    async gotoAdmin() {
        const adminUrl = this.params['root-url'] + '/admin1';
        console.log('Going to ' + adminUrl);
        await this.page.goto(adminUrl);
    }

    async login() {
        console.log('Logging in');
        await this.page.focus('#email');
        await this.page.type(this.params['admin-user']);
        await this.page.focus('#passwd');
        await this.page.type(this.params['admin-pass']);
        await this.page.click('button[name="submitLogin"]');
        await this.page.waitForNavigation();

        console.log('Canceling onboarding');
        try {
            await this.page.click('.onboarding-popup .buttons .onboarding-button-shut-down');
        } catch (e) {
            console.log('There was no onboarding')
        }
    }

    async configureModule() {
        console.log('Configuring module');
        await this.page.focus('[name="shop_id"]');
        await this.page.type(this.params['shop-id']);
        await this.page.focus('[name="api_key"]');
        await this.page.type(this.params['shop-key']);
        await this.page.click('#content form [type="submit"]');
        await this.page._waitForVisible('.module_confirmation.conf.confirm.alert.alert-success')
    }

    async logout() {
        console.log('Logging out');
        await this.page.click('#employee_infos > a[data-toggle="dropdown"]');
        await this.page._waitForVisible('#header_logout');
        await this.page.click('#header_logout');
        await this.page._waitForVisible('#login-panel');
    }

    async checkBanner() {
        console.log('Going to home this.page: ' + this.params['root-url']);
        await this.page.goto(this.params['root-url']);

        console.log('Waiting for sidebar to load');
        await this.page.waitForSelector('.wwk--sidebar', {visible: true});
    }

    installModule() {
        throw new Error('BaseTest::installModule() not implemented');
    }

    gotoModuleConfiguration() {
        throw new Error('BaseTest::gotoModuleConfiguration() not implemented');
    }

    getModuleFileName() {
        return this.params['module-dir'] + this.params['module-file'];
    }

    async run() {
        await this.gotoAdmin();
        await this.login();
        await this.installModule();
        await this.gotoModuleConfiguration();
        await this.configureModule();
        await this.logout();
        await this.checkBanner();
    }

    async sleep(miliseconds) {
        console.log('Sleeping for: ' + miliseconds + 'ms');
        return new Promise((resolve, reject) => setTimeout(resolve, miliseconds));
    }
}

exports.BaseTest = BaseTest;

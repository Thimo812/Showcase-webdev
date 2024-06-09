import {GDPR} from './gdpr.js';
import { SPAHandler } from './SPAHandler.js';
import AccountManager from './LogoutManager.js';

const spaHandler = new SPAHandler();
const gdpr = new GDPR();
const logoutManager = new AccountManager();
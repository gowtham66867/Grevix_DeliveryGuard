import test from 'node:test';
import assert from 'node:assert/strict';
import {allowedOrigin,listenHost} from '../server.mjs';
test('Cloud Run binds its injected port on all interfaces while local mode stays loopback',()=>{assert.equal(listenHost({K_SERVICE:'deliveryguard'}),'0.0.0.0');assert.equal(listenHost({}),'127.0.0.1');});
test('HTTPS proxy origin must exactly match host and reject suffix and foreign origins',()=>{assert.equal(allowedOrigin('https://deliveryguard.example','deliveryguard.example'),true);assert.equal(allowedOrigin('https://deliveryguard.example.evil','deliveryguard.example'),false);assert.equal(allowedOrigin('https://evil.example','deliveryguard.example'),false);assert.equal(allowedOrigin('null','deliveryguard.example'),false);});

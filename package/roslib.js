;(function () {
  function e(t, i, n) {
    function s(o, a) {
      if (!i[o]) {
        if (!t[o]) {
          var c = 'function' == typeof require && require
          if (!a && c) return c(o, !0)
          if (r) return r(o, !0)
          var l = Error("Cannot find module '" + o + "'")
          throw ((l.code = 'MODULE_NOT_FOUND'), l)
        }
        var u = (i[o] = { exports: {} })
        t[o][0].call(
          u.exports,
          function (e) {
            return s(t[o][1][e] || e)
          },
          u,
          u.exports,
          e,
          t,
          i,
          n
        )
      }
      return i[o].exports
    }
    for (var r = 'function' == typeof require && require, o = 0; o < n.length; o++) s(n[o])
    return s
  }
  return e
})()(
  {
    1: [
      function (e, t, i) {
        var n, s
        ;(n = this),
          (s = {
            encode: function e(t) {
              var i,
                n = new ArrayBuffer(256),
                s = new DataView(n),
                r = 0
              function o(e) {
                for (var t = n.byteLength, o = r + e; t < o; ) t *= 2
                if (t !== n.byteLength) {
                  var a = s
                  ;(n = new ArrayBuffer(t)), (s = new DataView(n))
                  for (var c = (r + 3) >> 2, l = 0; l < c; ++l)
                    s.setUint32(4 * l, a.getUint32(4 * l))
                }
                return (i = e), s
              }
              function a() {
                r += i
              }
              function c(e) {
                a(o(1).setUint8(r, e))
              }
              function l(e) {
                for (var t = o(e.length), i = 0; i < e.length; ++i) t.setUint8(r + i, e[i])
                a()
              }
              function u(e, t) {
                var i, n, s, l, u
                t < 24
                  ? c((e << 5) | t)
                  : t < 256
                  ? (c((e << 5) | 24), c(t))
                  : t < 65536
                  ? (c((e << 5) | 25), (i = t), a(o(2).setUint16(r, i)))
                  : t < 4294967296
                  ? (c((e << 5) | 26), (n = t), a(o(4).setUint32(r, n)))
                  : (c((e << 5) | 27),
                    (l = (s = t) % 4294967296),
                    (u = o(8)).setUint32(r, (s - l) / 4294967296),
                    u.setUint32(r + 4, l),
                    a())
              }
              if (
                ((function e(t) {
                  if (!1 === t) return c(244)
                  if (!0 === t) return c(245)
                  if (null === t) return c(246)
                  if (void 0 === t) return c(247)
                  switch (typeof t) {
                    case 'number':
                      var i
                      if (Math.floor(t) === t) {
                        if (0 <= t && t <= 9007199254740992) return u(0, t)
                        if (-9007199254740992 <= t && t < 0) return u(1, -(t + 1))
                      }
                      return c(251), (i = t), void a(o(8).setFloat64(r, i))
                    case 'string':
                      var n,
                        s,
                        h = []
                      for (n = 0; n < t.length; ++n) {
                        var f = t.charCodeAt(n)
                        f < 128
                          ? h.push(f)
                          : f < 2048
                          ? (h.push(192 | (f >> 6)), h.push(128 | (63 & f)))
                          : f < 55296
                          ? (h.push(224 | (f >> 12)),
                            h.push(128 | ((f >> 6) & 63)),
                            h.push(128 | (63 & f)))
                          : ((f = (1023 & f) << 10),
                            (f |= 1023 & t.charCodeAt(++n)),
                            (f += 65536),
                            h.push(240 | (f >> 18)),
                            h.push(128 | ((f >> 12) & 63)),
                            h.push(128 | ((f >> 6) & 63)),
                            h.push(128 | (63 & f)))
                      }
                      return u(3, h.length), l(h)
                    default:
                      if (Array.isArray(t)) for (u(4, (s = t.length)), n = 0; n < s; ++n) e(t[n])
                      else if (t instanceof Uint8Array) u(2, t.length), l(t)
                      else {
                        var p = Object.keys(t)
                        for (u(5, (s = p.length)), n = 0; n < s; ++n) {
                          var m = p[n]
                          e(m), e(t[m])
                        }
                      }
                  }
                })(t),
                'slice' in n)
              )
                return n.slice(0, r)
              for (var h = new ArrayBuffer(r), f = new DataView(h), p = 0; p < r; ++p)
                f.setUint8(p, s.getUint8(p))
              return h
            },
            decode: function e(t, i, n) {
              var s = new DataView(t),
                r = 0
              function o(e, t) {
                return (r += t), e
              }
              function a(e) {
                var i, n
                return (i = new Uint8Array(t, r, e)), (r += n = e), i
              }
              function c() {
                var e
                return (e = s.getUint8(r)), (r += 1), e
              }
              function l() {
                var e
                return (e = s.getUint16(r)), (r += 2), e
              }
              function u() {
                var e
                return (e = s.getUint32(r)), (r += 4), e
              }
              function h() {
                return 255 === s.getUint8(r) && ((r += 1), !0)
              }
              function f(e) {
                if (e < 24) return e
                if (24 === e) return c()
                if (25 === e) return l()
                if (26 === e) return u()
                if (27 === e) return 4294967296 * u() + u()
                if (31 === e) return -1
                throw 'Invalid length encoding'
              }
              function p(e) {
                var t = c()
                if (255 === t) return -1
                var i = f(31 & t)
                if (i < 0 || t >> 5 !== e) throw 'Invalid indefinite length element'
                return i
              }
              function m(e, t) {
                for (var i = 0; i < t; ++i) {
                  var n = c()
                  128 & n &&
                    (n < 224
                      ? ((n = ((31 & n) << 6) | (63 & c())), (t -= 1))
                      : n < 240
                      ? ((n = ((15 & n) << 12) | ((63 & c()) << 6) | (63 & c())), (t -= 2))
                      : ((n =
                          ((15 & n) << 18) | ((63 & c()) << 12) | ((63 & c()) << 6) | (63 & c())),
                        (t -= 3))),
                    n < 65536
                      ? e.push(n)
                      : ((n -= 65536), e.push(55296 | (n >> 10)), e.push(56320 | (1023 & n)))
                }
              }
              'function' != typeof i &&
                (i = function (e) {
                  return e
                }),
                'function' != typeof n && (n = function () {})
              var v = (function e() {
                var t,
                  o,
                  u,
                  v = c(),
                  d = v >> 5,
                  y = 31 & v
                if (7 === d)
                  switch (y) {
                    case 25:
                      return (function e() {
                        var t = new ArrayBuffer(4),
                          i = new DataView(t),
                          n = l(),
                          s = 31744 & n,
                          r = 1023 & n
                        if (31744 === s) s = 261120
                        else if (0 !== s) s += 114688
                        else if (0 !== r) return 5960464477539063e-23 * r
                        return (
                          i.setUint32(0, ((32768 & n) << 16) | (s << 13) | (r << 13)),
                          i.getFloat32(0)
                        )
                      })()
                    case 26:
                      return (x = s.getFloat32(r)), (r += 4), x
                    case 27:
                      return (k = s.getFloat64(r)), (r += 8), k
                  }
                if ((o = f(y)) < 0 && (d < 2 || 6 < d)) throw 'Invalid length'
                switch (d) {
                  case 0:
                    return o
                  case 1:
                    return -1 - o
                  case 2:
                    if (o < 0) {
                      for (var g = [], $ = 0; (o = p(d)) >= 0; ) ($ += o), g.push(a(o))
                      var b = new Uint8Array($),
                        w = 0
                      for (t = 0; t < g.length; ++t) b.set(g[t], w), (w += g[t].length)
                      return b
                    }
                    return a(o)
                  case 3:
                    var _ = []
                    if (o < 0) for (; (o = p(d)) >= 0; ) m(_, o)
                    else m(_, o)
                    return String.fromCharCode.apply(null, _)
                  case 4:
                    if (o < 0) for (u = []; !h(); ) u.push(e())
                    else for (t = 0, u = Array(o); t < o; ++t) u[t] = e()
                    return u
                  case 5:
                    var x,
                      T,
                      k,
                      L,
                      S = {}
                    for (t = 0; t < o || (o < 0 && !h()); ++t) S[e()] = e()
                    return S
                  case 6:
                    return i(e(), o)
                  case 7:
                    switch (o) {
                      case 20:
                        return !1
                      case 21:
                        return !0
                      case 22:
                        return null
                      case 23:
                        return
                      default:
                        return n(o)
                    }
                }
              })()
              if (r !== t.byteLength) throw 'Remaining bytes'
              return v
            }
          }),
          'function' == typeof define && define.amd
            ? define('cbor/cbor', s)
            : void 0 !== t && t.exports
            ? (t.exports = s)
            : n.CBOR || (n.CBOR = s)
      },
      {}
    ],
    2: [
      function (e, t, i) {
        ;(function (e, n) {
          ;(function () {
            !(function (s) {
              var r = Object.hasOwnProperty,
                o = Array.isArray
                  ? Array.isArray
                  : function e(t) {
                      return '[object Array]' === Object.prototype.toString.call(t)
                    },
                a = 'object' == typeof e && 'function' == typeof e.nextTick,
                c = 'function' == typeof Symbol,
                l = 'object' == typeof Reflect,
                u = 'function' == typeof n ? n : setTimeout,
                h = c
                  ? l && 'function' == typeof Reflect.ownKeys
                    ? Reflect.ownKeys
                    : function (e) {
                        var t = Object.getOwnPropertyNames(e)
                        return t.push.apply(t, Object.getOwnPropertySymbols(e)), t
                      }
                  : Object.keys
              function f() {
                ;(this._events = {}), this._conf && p.call(this, this._conf)
              }
              function p(e) {
                e &&
                  ((this._conf = e),
                  e.delimiter && (this.delimiter = e.delimiter),
                  s !== e.maxListeners && (this._maxListeners = e.maxListeners),
                  e.wildcard && (this.wildcard = e.wildcard),
                  e.newListener && (this._newListener = e.newListener),
                  e.removeListener && (this._removeListener = e.removeListener),
                  e.verboseMemoryLeak && (this.verboseMemoryLeak = e.verboseMemoryLeak),
                  e.ignoreErrors && (this.ignoreErrors = e.ignoreErrors),
                  this.wildcard && (this.listenerTree = {}))
              }
              function m(t, i) {
                var n =
                  '(node) warning: possible EventEmitter memory leak detected. ' +
                  t +
                  ' listeners added. Use emitter.setMaxListeners() to increase limit.'
                if (
                  (this.verboseMemoryLeak && (n += ' Event name: ' + i + '.'),
                  void 0 !== e && e.emitWarning)
                ) {
                  var s = Error(n)
                  ;(s.name = 'MaxListenersExceededWarning'),
                    (s.emitter = this),
                    (s.count = t),
                    e.emitWarning(s)
                } else console.error(n), console.trace && console.trace()
              }
              var v = function (e, t, i) {
                var n = arguments.length
                switch (n) {
                  case 0:
                    return []
                  case 1:
                    return [e]
                  case 2:
                    return [e, t]
                  case 3:
                    return [e, t, i]
                  default:
                    for (var s = Array(n); n--; ) s[n] = arguments[n]
                    return s
                }
              }
              function d(e, t) {
                for (var i, n = {}, r = e.length, o = t ? value.length : 0, a = 0; a < r; a++)
                  n[(i = e[a])] = a < o ? t[a] : s
                return n
              }
              function y(e, t, i) {
                if (
                  ((this._emitter = e),
                  (this._target = t),
                  (this._listeners = {}),
                  (this._listenersCount = 0),
                  (i.on || i.off) && ((n = i.on), (s = i.off)),
                  t.addEventListener
                    ? ((n = t.addEventListener), (s = t.removeEventListener))
                    : t.addListener
                    ? ((n = t.addListener), (s = t.removeListener))
                    : t.on && ((n = t.on), (s = t.off)),
                  !n && !s)
                )
                  throw Error('target does not implement any known event API')
                if ('function' != typeof n) throw TypeError('on method must be a function')
                if ('function' != typeof s) throw TypeError('off method must be a function')
                ;(this._on = n), (this._off = s)
                var n,
                  s,
                  r = e._observers
                r ? r.push(this) : (e._observers = [this])
              }
              function g(e, t, i, n) {
                var o,
                  a,
                  c,
                  l = Object.assign({}, t)
                if (!e) return l
                if ('object' != typeof e) throw TypeError('options must be an object')
                var u = Object.keys(e),
                  h = u.length
                function f(e) {
                  throw Error('Invalid "' + o + '" option value' + (e ? '. Reason: ' + e : ''))
                }
                for (var p = 0; p < h; p++) {
                  if (((o = u[p]), !n && !r.call(t, o))) throw Error('Unknown "' + o + '" option')
                  s !== (a = e[o]) && ((c = i[o]), (l[o] = c ? c(a, f) : a))
                }
                return l
              }
              function $(e, t) {
                return (
                  ('function' == typeof e && e.hasOwnProperty('prototype')) ||
                    t('value must be a constructor'),
                  e
                )
              }
              function b(e) {
                var t = 'value must be type of ' + e.join('|'),
                  i = e.length,
                  n = e[0],
                  s = e[1]
                return 1 === i
                  ? function (e, i) {
                      if (typeof e === n) return e
                      i(t)
                    }
                  : 2 === i
                  ? function (e, i) {
                      var r = typeof e
                      if (r === n || r === s) return e
                      i(t)
                    }
                  : function (n, s) {
                      for (var r = typeof n, o = i; o-- > 0; ) if (r === e[o]) return n
                      s(t)
                    }
              }
              Object.assign(y.prototype, {
                subscribe: function (e, t, i) {
                  var n = this,
                    s = this._target,
                    r = this._emitter,
                    o = this._listeners,
                    a = function () {
                      var n = v.apply(null, arguments),
                        o = { data: n, name: t, original: e }
                      if (i) {
                        !1 !== i.call(s, o) && r.emit.apply(r, [o.name].concat(n))
                        return
                      }
                      r.emit.apply(r, [t].concat(n))
                    }
                  if (o[e]) throw Error("Event '" + e + "' is already listening")
                  this._listenersCount++,
                    r._newListener && r._removeListener && !n._onNewListener
                      ? ((this._onNewListener = function (i) {
                          i === t && null === o[e] && ((o[e] = a), n._on.call(s, e, a))
                        }),
                        r.on('newListener', this._onNewListener),
                        (this._onRemoveListener = function (i) {
                          i === t &&
                            !r.hasListeners(i) &&
                            o[e] &&
                            ((o[e] = null), n._off.call(s, e, a))
                        }),
                        (o[e] = null),
                        r.on('removeListener', this._onRemoveListener))
                      : ((o[e] = a), n._on.call(s, e, a))
                },
                unsubscribe: function (e) {
                  var t,
                    i,
                    n,
                    s = this,
                    r = this._listeners,
                    o = this._emitter,
                    a = this._off,
                    c = this._target
                  if (e && 'string' != typeof e) throw TypeError('event must be a string')
                  function l() {
                    s._onNewListener &&
                      (o.off('newListener', s._onNewListener),
                      o.off('removeListener', s._onRemoveListener),
                      (s._onNewListener = null),
                      (s._onRemoveListener = null))
                    var e = T.call(o, s)
                    o._observers.splice(e, 1)
                  }
                  if (e) {
                    if (!(t = r[e])) return
                    a.call(c, e, t), delete r[e], --this._listenersCount || l()
                  } else {
                    for (n = (i = h(r)).length; n-- > 0; ) (e = i[n]), a.call(c, e, r[e])
                    ;(this._listeners = {}), (this._listenersCount = 0), l()
                  }
                }
              })
              var w = b(['function']),
                _ = b(['object', 'function'])
              function x(e, t, i) {
                var n,
                  s,
                  r,
                  o = 0,
                  a = new e(function (c, l, u) {
                    function h() {
                      s && (s = null), o && (clearTimeout(o), (o = 0))
                    }
                    n =
                      !(i = g(
                        i,
                        { timeout: 0, overload: !1 },
                        {
                          timeout: function (e, t) {
                            return (
                              ('number' != typeof (e *= 1) || e < 0 || !Number.isFinite(e)) &&
                                t('timeout must be a positive number'),
                              e
                            )
                          }
                        }
                      )).overload &&
                      'function' == typeof e.prototype.cancel &&
                      'function' == typeof u
                    var f = function (e) {
                        h(), c(e)
                      },
                      p = function (e) {
                        h(), l(e)
                      }
                    n
                      ? t(f, p, u)
                      : ((s = [
                          function (e) {
                            p(e || Error('canceled'))
                          }
                        ]),
                        t(f, p, function (e) {
                          if (r) throw Error('Unable to subscribe on cancel event asynchronously')
                          if ('function' != typeof e)
                            throw TypeError('onCancel callback must be a function')
                          s.push(e)
                        }),
                        (r = !0)),
                      i.timeout > 0 &&
                        (o = setTimeout(function () {
                          var e = Error('timeout')
                          ;(e.code = 'ETIMEDOUT'), (o = 0), a.cancel(e), l(e)
                        }, i.timeout))
                  })
                return (
                  n ||
                    (a.cancel = function (e) {
                      if (s) {
                        for (var t = s.length, i = 1; i < t; i++) s[i](e)
                        s[0](e), (s = null)
                      }
                    }),
                  a
                )
              }
              function T(e) {
                var t = this._observers
                if (!t) return -1
                for (var i = t.length, n = 0; n < i; n++) if (t[n]._target === e) return n
                return -1
              }
              function k(e, t, i, n, s) {
                if (!i) return null
                if (0 === n) {
                  var r = typeof t
                  if ('string' === r) {
                    var o,
                      a,
                      c = 0,
                      l = 0,
                      u = this.delimiter,
                      f = u.length
                    if (-1 !== (a = t.indexOf(u))) {
                      o = [, , , , ,]
                      do (o[c++] = t.slice(l, a)), (l = a + f)
                      while (-1 !== (a = t.indexOf(u, l)))
                      ;(o[c++] = t.slice(l)), (t = o), (s = c)
                    } else (t = [t]), (s = 1)
                  } else 'object' === r ? (s = t.length) : ((t = [t]), (s = 1))
                }
                var p,
                  m,
                  v,
                  d,
                  y,
                  g,
                  $,
                  b = null,
                  w = t[n],
                  _ = t[n + 1]
                if (n === s)
                  i._listeners &&
                    ('function' == typeof i._listeners
                      ? (e && e.push(i._listeners), (b = [i]))
                      : (e && e.push.apply(e, i._listeners), (b = [i])))
                else {
                  if ('*' === w) {
                    for (a = (g = h(i)).length; a-- > 0; )
                      '_listeners' !== (p = g[a]) &&
                        ($ = k(e, t, i[p], n + 1, s)) &&
                        (b ? b.push.apply(b, $) : (b = $))
                    return b
                  }
                  if ('**' === w) {
                    for (
                      (y = n + 1 === s || (n + 2 === s && '*' === _)) &&
                        i._listeners &&
                        (b = k(e, t, i, s, s)),
                        a = (g = h(i)).length;
                      a-- > 0;

                    )
                      '_listeners' !== (p = g[a]) &&
                        ('*' === p || '**' === p
                          ? (i[p]._listeners &&
                              !y &&
                              ($ = k(e, t, i[p], s, s)) &&
                              (b ? b.push.apply(b, $) : (b = $)),
                            ($ = k(e, t, i[p], n, s)))
                          : ($ = p === _ ? k(e, t, i[p], n + 2, s) : k(e, t, i[p], n, s)),
                        $ && (b ? b.push.apply(b, $) : (b = $)))
                    return b
                  }
                  i[w] && (b = k(e, t, i[w], n + 1, s))
                }
                if (((m = i['*']) && k(e, t, m, n + 1, s), (v = i['**']))) {
                  if (n < s)
                    for (v._listeners && k(e, t, v, s, s), a = (g = h(v)).length; a-- > 0; )
                      '_listeners' !== (p = g[a]) &&
                        (p === _
                          ? k(e, t, v[p], n + 2, s)
                          : p === w
                          ? k(e, t, v[p], n + 1, s)
                          : (((d = {})[p] = v[p]), k(e, t, { '**': d }, n + 1, s)))
                  else
                    v._listeners
                      ? k(e, t, v, s, s)
                      : v['*'] && v['*']._listeners && k(e, t, v['*'], s, s)
                }
                return b
              }
              function L(e, t, i) {
                var n,
                  s,
                  r = 0,
                  o = 0,
                  a = this.delimiter,
                  c = a.length
                if ('string' == typeof e) {
                  if (-1 !== (n = e.indexOf(a))) {
                    s = [, , , , ,]
                    do (s[r++] = e.slice(o, n)), (o = n + c)
                    while (-1 !== (n = e.indexOf(a, o)))
                    s[r++] = e.slice(o)
                  } else (s = [e]), (r = 1)
                } else (s = e), (r = e.length)
                if (r > 1) {
                  for (n = 0; n + 1 < r; n++) if ('**' === s[n] && '**' === s[n + 1]) return
                }
                var l,
                  u = this.listenerTree
                for (n = 0; n < r; n++)
                  if (((u = u[(l = s[n])] || (u[l] = {})), n === r - 1)) {
                    u._listeners
                      ? ('function' == typeof u._listeners && (u._listeners = [u._listeners]),
                        i ? u._listeners.unshift(t) : u._listeners.push(t),
                        !u._listeners.warned &&
                          this._maxListeners > 0 &&
                          u._listeners.length > this._maxListeners &&
                          ((u._listeners.warned = !0), m.call(this, u._listeners.length, l)))
                      : (u._listeners = t)
                    break
                  }
                return !0
              }
              function S(e, t, i, n) {
                for (var s, r, o, a, c = h(e), l = c.length, u = e._listeners; l-- > 0; )
                  (s = e[(r = c[l])]),
                    (o = '_listeners' === r ? i : i ? i.concat(r) : [r]),
                    (a = n || 'symbol' == typeof r),
                    u && t.push(a ? o : o.join(this.delimiter)),
                    'object' == typeof s && S.call(this, s, t, o, a)
                return t
              }
              function U(e) {
                for (var t, i, n, s = h(e), r = s.length; r-- > 0; )
                  (t = e[(i = s[r])]) && ((n = !0), '_listeners' === i || U(t) || delete e[i])
                return n
              }
              function A(e, t, i) {
                ;(this.emitter = e), (this.event = t), (this.listener = i)
              }
              function C(t, i, n) {
                if (!0 === n) o = !0
                else if (!1 === n) r = !0
                else {
                  if (!n || 'object' != typeof n)
                    throw TypeError('options should be an object or true')
                  var r = n.async,
                    o = n.promisify,
                    c = n.nextTick,
                    l = n.objectify
                }
                if (r || c || o) {
                  var h = i,
                    f = i._origin || i
                  if (c && !a) throw Error('process.nextTick is not supported')
                  o === s && (o = 'AsyncFunction' === i.constructor.name),
                    ((i = function () {
                      var t = arguments,
                        i = this,
                        n = this.event
                      return o
                        ? c
                          ? Promise.resolve()
                          : new Promise(function (e) {
                              u(e)
                            }).then(function () {
                              return (i.event = n), h.apply(i, t)
                            })
                        : (c ? e.nextTick : u)(function () {
                            ;(i.event = n), h.apply(i, t)
                          })
                    })._async = !0),
                    (i._origin = f)
                }
                return [i, l ? new A(this, t, i) : this]
              }
              function R(e) {
                ;(this._events = {}),
                  (this._newListener = !1),
                  (this._removeListener = !1),
                  (this.verboseMemoryLeak = !1),
                  p.call(this, e)
              }
              ;(A.prototype.off = function () {
                return this.emitter.off(this.event, this.listener), this
              }),
                (R.EventEmitter2 = R),
                (R.prototype.listenTo = function (e, t, i) {
                  if ('object' != typeof e) throw TypeError('target musts be an object')
                  var n = this
                  return (
                    (i = g(i, { on: s, off: s, reducers: s }, { on: w, off: w, reducers: _ })),
                    (function t(s) {
                      if ('object' != typeof s) throw TypeError('events must be an object')
                      var r,
                        o,
                        a = i.reducers,
                        c = T.call(n, e)
                      r = -1 === c ? new y(n, e, i) : n._observers[c]
                      for (
                        var l = h(s), u = l.length, f = 'function' == typeof a, p = 0;
                        p < u;
                        p++
                      )
                        (o = l[p]), r.subscribe(o, s[o] || o, f ? a : a && a[o])
                    })(o(t) ? d(t) : 'string' == typeof t ? d(t.split(/\s+/)) : t),
                    this
                  )
                }),
                (R.prototype.stopListeningTo = function (e, t) {
                  var i,
                    n = this._observers
                  if (!n) return !1
                  var s = n.length,
                    r = !1
                  if (e && 'object' != typeof e) throw TypeError('target should be an object')
                  for (; s-- > 0; )
                    (i = n[s]), (e && i._target !== e) || (i.unsubscribe(t), (r = !0))
                  return r
                }),
                (R.prototype.delimiter = '.'),
                (R.prototype.setMaxListeners = function (e) {
                  e !== s &&
                    ((this._maxListeners = e),
                    this._conf || (this._conf = {}),
                    (this._conf.maxListeners = e))
                }),
                (R.prototype.getMaxListeners = function () {
                  return this._maxListeners
                }),
                (R.prototype.event = ''),
                (R.prototype.once = function (e, t, i) {
                  return this._once(e, t, !1, i)
                }),
                (R.prototype.prependOnceListener = function (e, t, i) {
                  return this._once(e, t, !0, i)
                }),
                (R.prototype._once = function (e, t, i, n) {
                  return this._many(e, 1, t, i, n)
                }),
                (R.prototype.many = function (e, t, i, n) {
                  return this._many(e, t, i, !1, n)
                }),
                (R.prototype.prependMany = function (e, t, i, n) {
                  return this._many(e, t, i, !0, n)
                }),
                (R.prototype._many = function (e, t, i, n, s) {
                  var r = this
                  if ('function' != typeof i) throw Error('many only accepts instances of Function')
                  function o() {
                    return 0 == --t && r.off(e, o), i.apply(this, arguments)
                  }
                  return (o._origin = i), this._on(e, o, n, s)
                }),
                (R.prototype.emit = function () {
                  if (!this._events && !this._all) return !1
                  this._events || f.call(this)
                  var e,
                    t,
                    i,
                    n,
                    s,
                    r,
                    o,
                    a = arguments[0],
                    l = this.wildcard
                  if ('newListener' === a && !this._newListener && !this._events.newListener)
                    return !1
                  if (
                    l &&
                    ((o = a), 'newListener' !== a && 'removeListener' !== a && 'object' == typeof a)
                  ) {
                    if (((t = a.length), c)) {
                      for (i = 0; i < t; i++)
                        if ('symbol' == typeof a[i]) {
                          s = !0
                          break
                        }
                    }
                    s || (a = a.join(this.delimiter))
                  }
                  var u = arguments.length
                  if (this._all && this._all.length)
                    for (i = 0, t = (r = this._all.slice()).length; i < t; i++)
                      switch (((this.event = a), u)) {
                        case 1:
                          r[i].call(this, a)
                          break
                        case 2:
                          r[i].call(this, a, arguments[1])
                          break
                        case 3:
                          r[i].call(this, a, arguments[1], arguments[2])
                          break
                        default:
                          r[i].apply(this, arguments)
                      }
                  if (l) (r = []), k.call(this, r, o, this.listenerTree, 0, t)
                  else {
                    if ('function' == typeof (r = this._events[a])) {
                      switch (((this.event = a), u)) {
                        case 1:
                          r.call(this)
                          break
                        case 2:
                          r.call(this, arguments[1])
                          break
                        case 3:
                          r.call(this, arguments[1], arguments[2])
                          break
                        default:
                          for (n = 1, e = Array(u - 1); n < u; n++) e[n - 1] = arguments[n]
                          r.apply(this, e)
                      }
                      return !0
                    }
                    r && (r = r.slice())
                  }
                  if (r && r.length) {
                    if (u > 3) for (n = 1, e = Array(u - 1); n < u; n++) e[n - 1] = arguments[n]
                    for (i = 0, t = r.length; i < t; i++)
                      switch (((this.event = a), u)) {
                        case 1:
                          r[i].call(this)
                          break
                        case 2:
                          r[i].call(this, arguments[1])
                          break
                        case 3:
                          r[i].call(this, arguments[1], arguments[2])
                          break
                        default:
                          r[i].apply(this, e)
                      }
                    return !0
                  }
                  if (!this.ignoreErrors && !this._all && 'error' === a) {
                    if (arguments[1] instanceof Error) throw arguments[1]
                    throw Error("Uncaught, unspecified 'error' event.")
                  }
                  return !!this._all
                }),
                (R.prototype.emitAsync = function () {
                  if (!this._events && !this._all) return !1
                  this._events || f.call(this)
                  var e,
                    t,
                    i,
                    n,
                    s,
                    r,
                    o,
                    a = arguments[0],
                    l = this.wildcard
                  if ('newListener' === a && !this._newListener && !this._events.newListener)
                    return Promise.resolve([!1])
                  if (
                    l &&
                    ((r = a), 'newListener' !== a && 'removeListener' !== a && 'object' == typeof a)
                  ) {
                    if (((t = a.length), c)) {
                      for (i = 0; i < t; i++)
                        if ('symbol' == typeof a[i]) {
                          o = !0
                          break
                        }
                    }
                    o || (a = a.join(this.delimiter))
                  }
                  var u = [],
                    h = arguments.length
                  if (this._all)
                    for (i = 0, t = this._all.length; i < t; i++)
                      switch (((this.event = a), h)) {
                        case 1:
                          u.push(this._all[i].call(this, a))
                          break
                        case 2:
                          u.push(this._all[i].call(this, a, arguments[1]))
                          break
                        case 3:
                          u.push(this._all[i].call(this, a, arguments[1], arguments[2]))
                          break
                        default:
                          u.push(this._all[i].apply(this, arguments))
                      }
                  if (
                    (l
                      ? ((s = []), k.call(this, s, r, this.listenerTree, 0))
                      : (s = this._events[a]),
                    'function' == typeof s)
                  )
                    switch (((this.event = a), h)) {
                      case 1:
                        u.push(s.call(this))
                        break
                      case 2:
                        u.push(s.call(this, arguments[1]))
                        break
                      case 3:
                        u.push(s.call(this, arguments[1], arguments[2]))
                        break
                      default:
                        for (n = 1, e = Array(h - 1); n < h; n++) e[n - 1] = arguments[n]
                        u.push(s.apply(this, e))
                    }
                  else if (s && s.length) {
                    if (((s = s.slice()), h > 3))
                      for (n = 1, e = Array(h - 1); n < h; n++) e[n - 1] = arguments[n]
                    for (i = 0, t = s.length; i < t; i++)
                      switch (((this.event = a), h)) {
                        case 1:
                          u.push(s[i].call(this))
                          break
                        case 2:
                          u.push(s[i].call(this, arguments[1]))
                          break
                        case 3:
                          u.push(s[i].call(this, arguments[1], arguments[2]))
                          break
                        default:
                          u.push(s[i].apply(this, e))
                      }
                  } else if (!this.ignoreErrors && !this._all && 'error' === a)
                    return arguments[1] instanceof Error
                      ? Promise.reject(arguments[1])
                      : Promise.reject("Uncaught, unspecified 'error' event.")
                  return Promise.all(u)
                }),
                (R.prototype.on = function (e, t, i) {
                  return this._on(e, t, !1, i)
                }),
                (R.prototype.prependListener = function (e, t, i) {
                  return this._on(e, t, !0, i)
                }),
                (R.prototype.onAny = function (e) {
                  return this._onAny(e, !1)
                }),
                (R.prototype.prependAny = function (e) {
                  return this._onAny(e, !0)
                }),
                (R.prototype.addListener = R.prototype.on),
                (R.prototype._onAny = function (e, t) {
                  if ('function' != typeof e)
                    throw Error('onAny only accepts instances of Function')
                  return (
                    this._all || (this._all = []),
                    t ? this._all.unshift(e) : this._all.push(e),
                    this
                  )
                }),
                (R.prototype._on = function (e, t, i, n) {
                  if ('function' == typeof e) return this._onAny(e, t), this
                  if ('function' != typeof t) throw Error('on only accepts instances of Function')
                  this._events || f.call(this)
                  var r,
                    o = this
                  return (n !== s && ((t = (r = C.call(this, e, t, n))[0]), (o = r[1])),
                  this._newListener && this.emit('newListener', e, t),
                  this.wildcard)
                    ? (L.call(this, e, t, i), o)
                    : (this._events[e]
                        ? ('function' == typeof this._events[e] &&
                            (this._events[e] = [this._events[e]]),
                          i ? this._events[e].unshift(t) : this._events[e].push(t),
                          !this._events[e].warned &&
                            this._maxListeners > 0 &&
                            this._events[e].length > this._maxListeners &&
                            ((this._events[e].warned = !0),
                            m.call(this, this._events[e].length, e)))
                        : (this._events[e] = t),
                      o)
                }),
                (R.prototype.off = function (e, t) {
                  if ('function' != typeof t)
                    throw Error('removeListener only takes instances of Function')
                  var i,
                    n = []
                  if (this.wildcard) {
                    var s = 'string' == typeof e ? e.split(this.delimiter) : e.slice()
                    if (!(n = k.call(this, null, s, this.listenerTree, 0))) return this
                  } else {
                    if (!this._events[e]) return this
                    ;(i = this._events[e]), n.push({ _listeners: i })
                  }
                  for (var r = 0; r < n.length; r++) {
                    var a = n[r]
                    if (o((i = a._listeners))) {
                      for (var c = -1, l = 0, u = i.length; l < u; l++)
                        if (
                          i[l] === t ||
                          (i[l].listener && i[l].listener === t) ||
                          (i[l]._origin && i[l]._origin === t)
                        ) {
                          c = l
                          break
                        }
                      if (c < 0) continue
                      return (
                        this.wildcard ? a._listeners.splice(c, 1) : this._events[e].splice(c, 1),
                        0 === i.length &&
                          (this.wildcard ? delete a._listeners : delete this._events[e]),
                        this._removeListener && this.emit('removeListener', e, t),
                        this
                      )
                    }
                    ;(i === t ||
                      (i.listener && i.listener === t) ||
                      (i._origin && i._origin === t)) &&
                      (this.wildcard ? delete a._listeners : delete this._events[e],
                      this._removeListener && this.emit('removeListener', e, t))
                  }
                  return this.listenerTree && U(this.listenerTree), this
                }),
                (R.prototype.offAny = function (e) {
                  var t,
                    i = 0,
                    n = 0
                  if (e && this._all && this._all.length > 0) {
                    for (i = 0, n = (t = this._all).length; i < n; i++)
                      if (e === t[i]) {
                        t.splice(i, 1), this._removeListener && this.emit('removeListenerAny', e)
                        break
                      }
                  } else {
                    if (((t = this._all), this._removeListener))
                      for (i = 0, n = t.length; i < n; i++) this.emit('removeListenerAny', t[i])
                    this._all = []
                  }
                  return this
                }),
                (R.prototype.removeListener = R.prototype.off),
                (R.prototype.removeAllListeners = function (e) {
                  if (e === s) return this._events && f.call(this), this
                  if (this.wildcard) {
                    var t,
                      i,
                      n = k.call(this, null, e, this.listenerTree, 0)
                    if (!n) return this
                    for (i = 0; i < n.length; i++) (t = n[i])._listeners = null
                    this.listenerTree && U(this.listenerTree)
                  } else this._events && (this._events[e] = null)
                  return this
                }),
                (R.prototype.listeners = function (e) {
                  var t,
                    i,
                    n,
                    r,
                    o,
                    a = this._events
                  if (e === s) {
                    if (this.wildcard) throw Error('event name required for wildcard emitter')
                    if (!a) return []
                    for (r = (t = h(a)).length, n = []; r-- > 0; )
                      'function' == typeof (i = a[t[r]]) ? n.push(i) : n.push.apply(n, i)
                    return n
                  }
                  if (this.wildcard) {
                    if (!(o = this.listenerTree)) return []
                    var c = [],
                      l = 'string' == typeof e ? e.split(this.delimiter) : e.slice()
                    return k.call(this, c, l, o, 0), c
                  }
                  return a && (i = a[e]) ? ('function' == typeof i ? [i] : i) : []
                }),
                (R.prototype.eventNames = function (e) {
                  var t = this._events
                  return this.wildcard
                    ? S.call(this, this.listenerTree, [], null, e)
                    : t
                    ? h(t)
                    : []
                }),
                (R.prototype.listenerCount = function (e) {
                  return this.listeners(e).length
                }),
                (R.prototype.hasListeners = function (e) {
                  if (this.wildcard) {
                    var t = [],
                      i = 'string' == typeof e ? e.split(this.delimiter) : e.slice()
                    return k.call(this, t, i, this.listenerTree, 0), t.length > 0
                  }
                  var n = this._events,
                    r = this._all
                  return !!((r && r.length) || (n && (e === s ? h(n).length : n[e])))
                }),
                (R.prototype.listenersAny = function () {
                  return this._all ? this._all : []
                }),
                (R.prototype.waitFor = function (e, t) {
                  var i = this,
                    n = typeof t
                  return (
                    'number' === n ? (t = { timeout: t }) : 'function' === n && (t = { filter: t }),
                    x(
                      (t = g(
                        t,
                        { timeout: 0, filter: s, handleError: !1, Promise: Promise, overload: !1 },
                        { filter: w, Promise: $ }
                      )).Promise,
                      function (n, s, r) {
                        function o() {
                          var r = t.filter
                          if (!r || r.apply(i, arguments)) {
                            if ((i.off(e, o), t.handleError)) {
                              var a = arguments[0]
                              a ? s(a) : n(v.apply(null, arguments).slice(1))
                            } else n(v.apply(null, arguments))
                          }
                        }
                        r(function () {
                          i.off(e, o)
                        }),
                          i._on(e, o, !1)
                      },
                      { timeout: t.timeout, overload: t.overload }
                    )
                  )
                })
              var N = R.prototype
              ;(Object.defineProperties(R, {
                defaultMaxListeners: {
                  get: function () {
                    return N._maxListeners
                  },
                  set: function (e) {
                    if ('number' != typeof e || e < 0 || Number.isNaN(e))
                      throw TypeError('n must be a non-negative number')
                    N._maxListeners = e
                  },
                  enumerable: !0
                },
                once: {
                  value: function e(t, i, n) {
                    return x(
                      (n = g(n, { Promise: Promise, timeout: 0, overload: !1 }, { Promise: $ }))
                        .Promise,
                      function (e, n, s) {
                        if ('function' == typeof t.addEventListener) {
                          ;(r = function () {
                            e(v.apply(null, arguments))
                          }),
                            s(function () {
                              t.removeEventListener(i, r)
                            }),
                            t.addEventListener(i, r, { once: !0 })
                          return
                        }
                        var r,
                          o,
                          a = function () {
                            o && t.removeListener('error', o), e(v.apply(null, arguments))
                          }
                        'error' !== i &&
                          ((o = function (e) {
                            t.removeListener(i, a), n(e)
                          }),
                          t.once('error', o)),
                          s(function () {
                            o && t.removeListener('error', o), t.removeListener(i, a)
                          }),
                          t.once(i, a)
                      },
                      { timeout: n.timeout, overload: n.overload }
                    )
                  },
                  writable: !0,
                  configurable: !0
                }
              }),
              Object.defineProperties(N, {
                _maxListeners: { value: 10, writable: !0, configurable: !0 },
                _observers: { value: null, writable: !0, configurable: !0 }
              }),
              'function' == typeof define && define.amd)
                ? define(function () {
                    return R
                  })
                : 'object' == typeof i
                ? (t.exports = R)
                : (Function('', 'return this')().EventEmitter2 = R)
            })()
          }).call(this)
        }).call(this, e('_process'), e('timers').setImmediate)
      },
      { _process: 4, timers: 5 }
    ],
    3: [
      function (e, t, i) {
        /*
object-assign
(c) Sindre Sorhus
@license MIT
*/ 'use strict'
        var n = Object.getOwnPropertySymbols,
          s = Object.prototype.hasOwnProperty,
          r = Object.prototype.propertyIsEnumerable
        t.exports = !(function e() {
          try {
            if (!Object.assign) return !1
            var t = new String('abc')
            if (((t[5] = 'de'), '5' === Object.getOwnPropertyNames(t)[0])) return !1
            for (var i = {}, n = 0; n < 10; n++) i['_' + String.fromCharCode(n)] = n
            var s = Object.getOwnPropertyNames(i).map(function (e) {
              return i[e]
            })
            if ('0123456789' !== s.join('')) return !1
            var r = {}
            if (
              ('abcdefghijklmnopqrst'.split('').forEach(function (e) {
                r[e] = e
              }),
              'abcdefghijklmnopqrst' !== Object.keys(Object.assign({}, r)).join(''))
            )
              return !1
            return !0
          } catch (o) {
            return !1
          }
        })()
          ? function (e, t) {
              for (
                var i,
                  o,
                  a = (function e(t) {
                    if (null == t)
                      throw TypeError('Object.assign cannot be called with null or undefined')
                    return Object(t)
                  })(e),
                  c = 1;
                c < arguments.length;
                c++
              ) {
                for (var l in (i = Object(arguments[c]))) s.call(i, l) && (a[l] = i[l])
                if (n) {
                  o = n(i)
                  for (var u = 0; u < o.length; u++) r.call(i, o[u]) && (a[o[u]] = i[o[u]])
                }
              }
              return a
            }
          : Object.assign
      },
      {}
    ],
    4: [
      function (e, t, i) {
        var n,
          s,
          r,
          o = (t.exports = {})
        function a() {
          throw Error('setTimeout has not been defined')
        }
        function c() {
          throw Error('clearTimeout has not been defined')
        }
        function l(e) {
          if (n === setTimeout) return setTimeout(e, 0)
          if ((n === a || !n) && setTimeout) return (n = setTimeout), setTimeout(e, 0)
          try {
            return n(e, 0)
          } catch (t) {
            try {
              return n.call(null, e, 0)
            } catch (i) {
              return n.call(this, e, 0)
            }
          }
        }
        !(function () {
          try {
            n = 'function' == typeof setTimeout ? setTimeout : a
          } catch (e) {
            n = a
          }
          try {
            s = 'function' == typeof clearTimeout ? clearTimeout : c
          } catch (t) {
            s = c
          }
        })()
        var u = [],
          h = !1,
          f = -1
        function p() {
          h && r && ((h = !1), r.length ? (u = r.concat(u)) : (f = -1), u.length && m())
        }
        function m() {
          if (!h) {
            var e = l(p)
            h = !0
            for (var t = u.length; t; ) {
              for (r = u, u = []; ++f < t; ) r && r[f].run()
              ;(f = -1), (t = u.length)
            }
            ;(r = null),
              (h = !1),
              (function e(t) {
                if (s === clearTimeout) return clearTimeout(t)
                if ((s === c || !s) && clearTimeout) return (s = clearTimeout), clearTimeout(t)
                try {
                  return s(t)
                } catch (i) {
                  try {
                    return s.call(null, t)
                  } catch (n) {
                    return s.call(this, t)
                  }
                }
              })(e)
          }
        }
        function v(e, t) {
          ;(this.fun = e), (this.array = t)
        }
        function d() {}
        ;(o.nextTick = function (e) {
          var t = Array(arguments.length - 1)
          if (arguments.length > 1)
            for (var i = 1; i < arguments.length; i++) t[i - 1] = arguments[i]
          u.push(new v(e, t)), 1 !== u.length || h || l(m)
        }),
          (v.prototype.run = function () {
            this.fun.apply(null, this.array)
          }),
          (o.title = 'browser'),
          (o.browser = !0),
          (o.env = {}),
          (o.argv = []),
          (o.version = ''),
          (o.versions = {}),
          (o.on = d),
          (o.addListener = d),
          (o.once = d),
          (o.off = d),
          (o.removeListener = d),
          (o.removeAllListeners = d),
          (o.emit = d),
          (o.prependListener = d),
          (o.prependOnceListener = d),
          (o.listeners = function (e) {
            return []
          }),
          (o.binding = function (e) {
            throw Error('process.binding is not supported')
          }),
          (o.cwd = function () {
            return '/'
          }),
          (o.chdir = function (e) {
            throw Error('process.chdir is not supported')
          }),
          (o.umask = function () {
            return 0
          })
      },
      {}
    ],
    5: [
      function (e, t, i) {
        ;(function (t, n) {
          ;(function () {
            var s = e('process/browser.js').nextTick,
              r = Function.prototype.apply,
              o = Array.prototype.slice,
              a = {},
              c = 0
            function l(e, t) {
              ;(this._id = e), (this._clearFn = t)
            }
            ;(i.setTimeout = function () {
              return new l(r.call(setTimeout, window, arguments), clearTimeout)
            }),
              (i.setInterval = function () {
                return new l(r.call(setInterval, window, arguments), clearInterval)
              }),
              (i.clearTimeout = i.clearInterval =
                function (e) {
                  e.close()
                }),
              (l.prototype.unref = l.prototype.ref = function () {}),
              (l.prototype.close = function () {
                this._clearFn.call(window, this._id)
              }),
              (i.enroll = function (e, t) {
                clearTimeout(e._idleTimeoutId), (e._idleTimeout = t)
              }),
              (i.unenroll = function (e) {
                clearTimeout(e._idleTimeoutId), (e._idleTimeout = -1)
              }),
              (i._unrefActive = i.active =
                function (e) {
                  clearTimeout(e._idleTimeoutId)
                  var t = e._idleTimeout
                  t >= 0 &&
                    (e._idleTimeoutId = setTimeout(function t() {
                      e._onTimeout && e._onTimeout()
                    }, t))
                }),
              (i.setImmediate =
                'function' == typeof t
                  ? t
                  : function (e) {
                      var t = c++,
                        n = !(arguments.length < 2) && o.call(arguments, 1)
                      return (
                        (a[t] = !0),
                        s(function s() {
                          a[t] && (n ? e.apply(null, n) : e.call(null), i.clearImmediate(t))
                        }),
                        t
                      )
                    }),
              (i.clearImmediate =
                'function' == typeof n
                  ? n
                  : function (e) {
                      delete a[e]
                    })
          }).call(this)
        }).call(this, e('timers').setImmediate, e('timers').clearImmediate)
      },
      { 'process/browser.js': 4, timers: 5 }
    ],
    6: [
      function (e, t, i) {
        function n(e) {
          var t = {}
          function i(n) {
            if (t[n]) return t[n].exports
            var s = (t[n] = { i: n, l: !1, exports: {} })
            return e[n].call(s.exports, s, s.exports, i), (s.l = !0), s.exports
          }
          ;(i.m = e),
            (i.c = t),
            (i.i = function (e) {
              return e
            }),
            (i.d = function (e, t, n) {
              i.o(e, t) || Object.defineProperty(e, t, { configurable: !1, enumerable: !0, get: n })
            }),
            (i.r = function (e) {
              Object.defineProperty(e, '__esModule', { value: !0 })
            }),
            (i.n = function (e) {
              var t =
                e && e.__esModule
                  ? function t() {
                      return e.default
                    }
                  : function t() {
                      return e
                    }
              return i.d(t, 'a', t), t
            }),
            (i.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t)
            }),
            (i.p = '/'),
            (i.oe = function (e) {
              throw (console.error(e), e)
            })
          var n = i((i.s = ENTRY_MODULE))
          return n.default || n
        }
        var s = '[\\.|\\-|\\+|\\w|/|@]+',
          r = '\\(\\s*(/\\*.*?\\*/)?\\s*.*?(' + s + ').*?\\)'
        function o(e) {
          return (e + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
        }
        function a(e) {
          return !isNaN(1 * e)
        }
        function c(e, t, i) {
          var n,
            c = {}
          c[i] = []
          var l = t.toString(),
            u = l.match(/^function\s?\w*\(\w+,\s*\w+,\s*(\w+)\)/)
          if (!u) return c
          for (var h = u[1], f = RegExp('(\\\\n|\\W)' + o(h) + r, 'g'); (n = f.exec(l)); )
            'dll-reference' !== n[3] && c[i].push(n[3])
          for (
            f = RegExp('\\(' + o(h) + '\\("(dll-reference\\s(' + s + '))"\\)\\)' + r, 'g');
            (n = f.exec(l));

          )
            e[n[2]] || (c[i].push(n[1]), (e[n[2]] = __webpack_require__(n[1]).m)),
              (c[n[2]] = c[n[2]] || []),
              c[n[2]].push(n[4])
          for (var p = Object.keys(c), m = 0; m < p.length; m++)
            for (var v = 0; v < c[p[m]].length; v++) a(c[p[m]][v]) && (c[p[m]][v] = 1 * c[p[m]][v])
          return c
        }
        function l(e) {
          return Object.keys(e).reduce(function (t, i) {
            return t || e[i].length > 0
          }, !1)
        }
        t.exports = function (e, t) {
          var i = { main: __webpack_modules__ },
            s = (t = t || {}).all
              ? { main: Object.keys(i.main) }
              : (function e(t, i) {
                  for (var n = { main: [i] }, s = { main: [] }, r = { main: {} }; l(n); )
                    for (var o = Object.keys(n), a = 0; a < o.length; a++) {
                      var u = o[a],
                        h = n[u].pop()
                      if (((r[u] = r[u] || {}), !r[u][h] && t[u][h])) {
                        ;(r[u][h] = !0), (s[u] = s[u] || []), s[u].push(h)
                        for (var f = c(t, t[u][h], u), p = Object.keys(f), m = 0; m < p.length; m++)
                          (n[p[m]] = n[p[m]] || []), (n[p[m]] = n[p[m]].concat(f[p[m]]))
                      }
                    }
                  return s
                })(i, e),
            r = ''
          Object.keys(s)
            .filter(function (e) {
              return 'main' !== e
            })
            .forEach(function (e) {
              for (var t = 0; s[e][t]; ) t++
              s[e].push(t),
                (i[e][t] =
                  '(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })'),
                (r =
                  r +
                  'var ' +
                  e +
                  ' = (' +
                  n.toString().replace('ENTRY_MODULE', JSON.stringify(t)) +
                  ')({' +
                  s[e]
                    .map(function (t) {
                      return '' + JSON.stringify(t) + ': ' + i[e][t].toString()
                    })
                    .join(',') +
                  '});\n')
            }),
            (r =
              r +
              'new ((' +
              n.toString().replace('ENTRY_MODULE', JSON.stringify(e)) +
              ')({' +
              s.main
                .map(function (e) {
                  return '' + JSON.stringify(e) + ': ' + i.main[e].toString()
                })
                .join(',') +
              '}))(self);')
          var o = new window.Blob([r], { type: 'text/javascript' })
          if (t.bare) return o
          var a = (window.URL || window.webkitURL || window.mozURL || window.msURL).createObjectURL(
              o
            ),
            u = new window.Worker(a)
          return (u.objectURL = a), u
        }
      },
      {}
    ],
    7: [
      function (e, t, i) {
        var n = arguments[3],
          s = arguments[4],
          r = arguments[5],
          o = JSON.stringify
        t.exports = function (e, t) {
          for (var i, a = Object.keys(r), c = 0, l = a.length; c < l; c++) {
            var u = a[c],
              h = r[u].exports
            if (h === e || (h && h.default === e)) {
              i = u
              break
            }
          }
          if (!i) {
            i = Math.floor(4294967296 * Math.random()).toString(16)
            for (var f = {}, c = 0, l = a.length; c < l; c++) {
              var u = a[c]
              f[u] = u
            }
            s[i] = ['function(require,module,exports){' + e + '(self); }', f]
          }
          var p = Math.floor(4294967296 * Math.random()).toString(16),
            m = {}
          ;(m[i] = i),
            (s[p] = [
              'function(require,module,exports){var f = require(' +
                o(i) +
                ');(f.default ? f.default : f)(self);}',
              m
            ])
          var v = {}
          !(function e(t) {
            for (var i in ((v[t] = !0), s[t][1])) {
              var n = s[t][1][i]
              v[n] || e(n)
            }
          })(p)
          var d =
              '(' +
              n +
              ')({' +
              Object.keys(v)
                .map(function (e) {
                  return o(e) + ':[' + s[e][0] + ',' + o(s[e][1]) + ']'
                })
                .join(',') +
              '},{},[' +
              o(p) +
              '])',
            y = window.URL || window.webkitURL || window.mozURL || window.msURL,
            g = new Blob([d], { type: 'text/javascript' })
          if (t && t.bare) return g
          var $ = y.createObjectURL(g),
            b = new Worker($)
          return (b.objectURL = $), b
        }
      },
      {}
    ],
    8: [
      function (e, t, i) {
        var n = this.ROSLIB || { REVISION: '1.2.0' },
          s = e('object-assign')
        s(n, e('./core')),
          s(n, e('./actionlib')),
          s(n, e('./math')),
          s(n, e('./tf')),
          s(n, e('./urdf')),
          (t.exports = n)
      },
      {
        './actionlib': 14,
        './core': 23,
        './math': 28,
        './tf': 31,
        './urdf': 43,
        'object-assign': 3
      }
    ],
    9: [
      function (e, t, i) {
        ;(function (t) {
          ;(function () {
            t.ROSLIB = e('./RosLib')
          }).call(this)
        }).call(
          this,
          'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
            ? self
            : 'undefined' != typeof window
            ? window
            : {}
        )
      },
      { './RosLib': 8 }
    ],
    10: [
      function (e, t, i) {
        var n = e('../core/Topic'),
          s = e('../core/Message'),
          r = e('eventemitter2').EventEmitter2
        function o(e) {
          var t = this
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.serverName = e.serverName),
            (this.actionName = e.actionName),
            (this.timeout = e.timeout),
            (this.omitFeedback = e.omitFeedback),
            (this.omitStatus = e.omitStatus),
            (this.omitResult = e.omitResult),
            (this.goals = {})
          var i = !1
          ;(this.feedbackListener = new n({
            ros: this.ros,
            name: this.serverName + '/feedback',
            messageType: this.actionName + 'Feedback'
          })),
            (this.statusListener = new n({
              ros: this.ros,
              name: this.serverName + '/status',
              messageType: 'actionlib_msgs/GoalStatusArray'
            })),
            (this.resultListener = new n({
              ros: this.ros,
              name: this.serverName + '/result',
              messageType: this.actionName + 'Result'
            })),
            (this.goalTopic = new n({
              ros: this.ros,
              name: this.serverName + '/goal',
              messageType: this.actionName + 'Goal'
            })),
            (this.cancelTopic = new n({
              ros: this.ros,
              name: this.serverName + '/cancel',
              messageType: 'actionlib_msgs/GoalID'
            })),
            this.goalTopic.advertise(),
            this.cancelTopic.advertise(),
            this.omitStatus ||
              this.statusListener.subscribe(function (e) {
                ;(i = !0),
                  e.status_list.forEach(function (e) {
                    var i = t.goals[e.goal_id.id]
                    i && i.emit('status', e)
                  })
              }),
            this.omitFeedback ||
              this.feedbackListener.subscribe(function (e) {
                var i = t.goals[e.status.goal_id.id]
                i && (i.emit('status', e.status), i.emit('feedback', e.feedback))
              }),
            this.omitResult ||
              this.resultListener.subscribe(function (e) {
                var i = t.goals[e.status.goal_id.id]
                i && (i.emit('status', e.status), i.emit('result', e.result))
              }),
            this.timeout &&
              setTimeout(function () {
                i || t.emit('timeout')
              }, this.timeout)
        }
        ;(o.prototype.__proto__ = r.prototype),
          (o.prototype.cancel = function () {
            var e = new s()
            this.cancelTopic.publish(e)
          }),
          (o.prototype.dispose = function () {
            this.goalTopic.unadvertise(),
              this.cancelTopic.unadvertise(),
              this.omitStatus || this.statusListener.unsubscribe(),
              this.omitFeedback || this.feedbackListener.unsubscribe(),
              this.omitResult || this.resultListener.unsubscribe()
          }),
          (t.exports = o)
      },
      { '../core/Message': 15, '../core/Topic': 22, eventemitter2: 2 }
    ],
    11: [
      function (e, t, i) {
        var n = e('../core/Topic')
        e('../core/Message')
        var s = e('eventemitter2').EventEmitter2
        function r(e) {
          var t = this
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.serverName = e.serverName),
            (this.actionName = e.actionName),
            (this.timeout = e.timeout),
            (this.omitFeedback = e.omitFeedback),
            (this.omitStatus = e.omitStatus),
            (this.omitResult = e.omitResult)
          var i = new n({
              ros: this.ros,
              name: this.serverName + '/goal',
              messageType: this.actionName + 'Goal'
            }),
            s = new n({
              ros: this.ros,
              name: this.serverName + '/feedback',
              messageType: this.actionName + 'Feedback'
            }),
            r = new n({
              ros: this.ros,
              name: this.serverName + '/status',
              messageType: 'actionlib_msgs/GoalStatusArray'
            }),
            o = new n({
              ros: this.ros,
              name: this.serverName + '/result',
              messageType: this.actionName + 'Result'
            })
          i.subscribe(function (e) {
            t.emit('goal', e)
          }),
            r.subscribe(function (e) {
              e.status_list.forEach(function (e) {
                t.emit('status', e)
              })
            }),
            s.subscribe(function (e) {
              t.emit('status', e.status), t.emit('feedback', e.feedback)
            }),
            o.subscribe(function (e) {
              t.emit('status', e.status), t.emit('result', e.result)
            })
        }
        ;(r.prototype.__proto__ = s.prototype), (t.exports = r)
      },
      { '../core/Message': 15, '../core/Topic': 22, eventemitter2: 2 }
    ],
    12: [
      function (e, t, i) {
        var n = e('../core/Message'),
          s = e('eventemitter2').EventEmitter2
        function r(e) {
          var t = this
          ;(this.actionClient = e.actionClient),
            (this.goalMessage = e.goalMessage),
            (this.isFinished = !1)
          var i = new Date()
          ;(this.goalID = 'goal_' + Math.random() + '_' + i.getTime()),
            (this.goalMessage = new n({
              goal_id: { stamp: { secs: 0, nsecs: 0 }, id: this.goalID },
              goal: this.goalMessage
            })),
            this.on('status', function (e) {
              t.status = e
            }),
            this.on('result', function (e) {
              ;(t.isFinished = !0), (t.result = e)
            }),
            this.on('feedback', function (e) {
              t.feedback = e
            }),
            (this.actionClient.goals[this.goalID] = this)
        }
        ;(r.prototype.__proto__ = s.prototype),
          (r.prototype.send = function (e) {
            var t = this
            t.actionClient.goalTopic.publish(t.goalMessage),
              e &&
                setTimeout(function () {
                  t.isFinished || t.emit('timeout')
                }, e)
          }),
          (r.prototype.cancel = function () {
            var e = new n({ id: this.goalID })
            this.actionClient.cancelTopic.publish(e)
          }),
          (t.exports = r)
      },
      { '../core/Message': 15, eventemitter2: 2 }
    ],
    13: [
      function (e, t, i) {
        var n = e('../core/Topic'),
          s = e('../core/Message'),
          r = e('eventemitter2').EventEmitter2
        function o(e) {
          var t = this
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.serverName = e.serverName),
            (this.actionName = e.actionName),
            (this.feedbackPublisher = new n({
              ros: this.ros,
              name: this.serverName + '/feedback',
              messageType: this.actionName + 'Feedback'
            })),
            this.feedbackPublisher.advertise()
          var i = new n({
            ros: this.ros,
            name: this.serverName + '/status',
            messageType: 'actionlib_msgs/GoalStatusArray'
          })
          i.advertise(),
            (this.resultPublisher = new n({
              ros: this.ros,
              name: this.serverName + '/result',
              messageType: this.actionName + 'Result'
            })),
            this.resultPublisher.advertise()
          var r = new n({
              ros: this.ros,
              name: this.serverName + '/goal',
              messageType: this.actionName + 'Goal'
            }),
            o = new n({
              ros: this.ros,
              name: this.serverName + '/cancel',
              messageType: 'actionlib_msgs/GoalID'
            })
          ;(this.statusMessage = new s({
            header: { stamp: { secs: 0, nsecs: 100 }, frame_id: '' },
            status_list: []
          })),
            (this.currentGoal = null),
            (this.nextGoal = null),
            r.subscribe(function (e) {
              t.currentGoal
                ? ((t.nextGoal = e), t.emit('cancel'))
                : ((t.statusMessage.status_list = [{ goal_id: e.goal_id, status: 1 }]),
                  (t.currentGoal = e),
                  t.emit('goal', e.goal))
            })
          var a = function (e, t) {
            return !(e.secs > t.secs) && (!!(e.secs < t.secs) || !!(e.nsecs < t.nsecs))
          }
          o.subscribe(function (e) {
            0 === e.stamp.secs && 0 === e.stamp.secs && '' === e.id
              ? ((t.nextGoal = null), t.currentGoal && t.emit('cancel'))
              : (t.currentGoal && e.id === t.currentGoal.goal_id.id
                  ? t.emit('cancel')
                  : t.nextGoal && e.id === t.nextGoal.goal_id.id && (t.nextGoal = null),
                t.nextGoal && a(t.nextGoal.goal_id.stamp, e.stamp) && (t.nextGoal = null),
                t.currentGoal && a(t.currentGoal.goal_id.stamp, e.stamp) && t.emit('cancel'))
          }),
            setInterval(function () {
              var e = new Date(),
                n = Math.floor(e.getTime() / 1e3),
                s = Math.round(1e9 * (e.getTime() / 1e3 - n))
              ;(t.statusMessage.header.stamp.secs = n),
                (t.statusMessage.header.stamp.nsecs = s),
                i.publish(t.statusMessage)
            }, 500)
        }
        ;(o.prototype.__proto__ = r.prototype),
          (o.prototype.setSucceeded = function (e) {
            var t = new s({ status: { goal_id: this.currentGoal.goal_id, status: 3 }, result: e })
            this.resultPublisher.publish(t),
              (this.statusMessage.status_list = []),
              this.nextGoal
                ? ((this.currentGoal = this.nextGoal),
                  (this.nextGoal = null),
                  this.emit('goal', this.currentGoal.goal))
                : (this.currentGoal = null)
          }),
          (o.prototype.setAborted = function (e) {
            var t = new s({ status: { goal_id: this.currentGoal.goal_id, status: 4 }, result: e })
            this.resultPublisher.publish(t),
              (this.statusMessage.status_list = []),
              this.nextGoal
                ? ((this.currentGoal = this.nextGoal),
                  (this.nextGoal = null),
                  this.emit('goal', this.currentGoal.goal))
                : (this.currentGoal = null)
          }),
          (o.prototype.sendFeedback = function (e) {
            var t = new s({ status: { goal_id: this.currentGoal.goal_id, status: 1 }, feedback: e })
            this.feedbackPublisher.publish(t)
          }),
          (o.prototype.setPreempted = function () {
            this.statusMessage.status_list = []
            var e = new s({ status: { goal_id: this.currentGoal.goal_id, status: 2 } })
            this.resultPublisher.publish(e),
              this.nextGoal
                ? ((this.currentGoal = this.nextGoal),
                  (this.nextGoal = null),
                  this.emit('goal', this.currentGoal.goal))
                : (this.currentGoal = null)
          }),
          (t.exports = o)
      },
      { '../core/Message': 15, '../core/Topic': 22, eventemitter2: 2 }
    ],
    14: [
      function (e, t, i) {
        var n = e('../core/Ros'),
          s = e('../mixin'),
          r = (t.exports = {
            ActionClient: e('./ActionClient'),
            ActionListener: e('./ActionListener'),
            Goal: e('./Goal'),
            SimpleActionServer: e('./SimpleActionServer')
          })
        s(n, ['ActionClient', 'SimpleActionServer'], r)
      },
      {
        '../core/Ros': 17,
        '../mixin': 29,
        './ActionClient': 10,
        './ActionListener': 11,
        './Goal': 12,
        './SimpleActionServer': 13
      }
    ],
    15: [
      function (e, t, i) {
        var n = e('object-assign')
        t.exports = function e(t) {
          n(this, t)
        }
      },
      { 'object-assign': 3 }
    ],
    16: [
      function (e, t, i) {
        var n = e('./Service'),
          s = e('./ServiceRequest')
        function r(e) {
          ;(e = e || {}), (this.ros = e.ros), (this.name = e.name)
        }
        ;(r.prototype.get = function (e) {
          var t = new n({
              ros: this.ros,
              name: '/rosapi/get_param',
              serviceType: 'rosapi/GetParam'
            }),
            i = new s({ name: this.name })
          t.callService(i, function (t) {
            e(JSON.parse(t.value))
          })
        }),
          (r.prototype.set = function (e, t) {
            var i = new n({
                ros: this.ros,
                name: '/rosapi/set_param',
                serviceType: 'rosapi/SetParam'
              }),
              r = new s({ name: this.name, value: JSON.stringify(e) })
            i.callService(r, t)
          }),
          (r.prototype.delete = function (e) {
            var t = new n({
                ros: this.ros,
                name: '/rosapi/delete_param',
                serviceType: 'rosapi/DeleteParam'
              }),
              i = new s({ name: this.name })
            t.callService(i, e)
          }),
          (t.exports = r)
      },
      { './Service': 18, './ServiceRequest': 19 }
    ],
    17: [
      function (e, t, i) {
        var n = e('ws'),
          s = e('../util/workerSocket'),
          r = e('./SocketAdapter.js'),
          o = e('./Service'),
          a = e('./ServiceRequest'),
          c = e('object-assign'),
          l = e('eventemitter2').EventEmitter2
        function u(e) {
          e = e || {}
          var t = this
          ;(this.socket = null),
            (this.idCounter = 0),
            (this.isConnected = !1),
            (this.transportLibrary = e.transportLibrary || 'websocket'),
            (this.transportOptions = e.transportOptions || {}),
            (this._sendFunc = function (e) {
              t.sendEncodedMessage(e)
            }),
            void 0 === e.groovyCompatibility
              ? (this.groovyCompatibility = !0)
              : (this.groovyCompatibility = e.groovyCompatibility),
            this.setMaxListeners(0),
            e.url && this.connect(e.url)
        }
        ;(u.prototype.__proto__ = l.prototype),
          (u.prototype.connect = function (e) {
            if ('socket.io' === this.transportLibrary)
              (this.socket = c(io(e, { 'force new connection': !0 }), r(this))),
                this.socket.on('connect', this.socket.onopen),
                this.socket.on('data', this.socket.onmessage),
                this.socket.on('close', this.socket.onclose),
                this.socket.on('error', this.socket.onerror)
            else if ('RTCPeerConnection' === this.transportLibrary.constructor.name)
              this.socket = c(
                this.transportLibrary.createDataChannel(e, this.transportOptions),
                r(this)
              )
            else if ('websocket' === this.transportLibrary) {
              if (!this.socket || this.socket.readyState === n.CLOSED) {
                var t = new n(e)
                ;(t.binaryType = 'arraybuffer'), (this.socket = c(t, r(this)))
              }
            } else if ('workersocket' === this.transportLibrary) this.socket = c(new s(e), r(this))
            else throw 'Unknown transportLibrary: ' + this.transportLibrary.toString()
          }),
          (u.prototype.close = function () {
            this.socket && this.socket.close()
          }),
          (u.prototype.authenticate = function (e, t, i, n, s, r, o) {
            this.callOnConnection({
              op: 'auth',
              mac: e,
              client: t,
              dest: i,
              rand: n,
              t: s,
              level: r,
              end: o
            })
          }),
          (u.prototype.sendEncodedMessage = function (e) {
            var t = null,
              i = this
            ;(t =
              'socket.io' === this.transportLibrary
                ? function (e) {
                    i.socket.emit('operation', e)
                  }
                : function (e) {
                    i.socket.send(e)
                  }),
              this.isConnected
                ? t(e)
                : i.once('connection', function () {
                    t(e)
                  })
          }),
          (u.prototype.callOnConnection = function (e) {
            this.transportOptions.encoder
              ? this.transportOptions.encoder(e, this._sendFunc)
              : this._sendFunc(JSON.stringify(e))
          }),
          (u.prototype.setStatusLevel = function (e, t) {
            this.callOnConnection({ op: 'set_level', level: e, id: t })
          }),
          (u.prototype.getActionServers = function (e, t) {
            var i = new o({
                ros: this,
                name: '/rosapi/action_servers',
                serviceType: 'rosapi/GetActionServers'
              }),
              n = new a({})
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t.action_servers)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t.action_servers)
                })
          }),
          (u.prototype.getTopics = function (e, t) {
            var i = new o({ ros: this, name: '/rosapi/topics', serviceType: 'rosapi/Topics' }),
              n = new a()
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t)
                })
          }),
          (u.prototype.getTopicsForType = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/topics_for_type',
                serviceType: 'rosapi/TopicsForType'
              }),
              s = new a({ type: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.topics)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e.topics)
                })
          }),
          (u.prototype.getServices = function (e, t) {
            var i = new o({ ros: this, name: '/rosapi/services', serviceType: 'rosapi/Services' }),
              n = new a()
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t.services)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t.services)
                })
          }),
          (u.prototype.getServicesForType = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/services_for_type',
                serviceType: 'rosapi/ServicesForType'
              }),
              s = new a({ type: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.services)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e.services)
                })
          }),
          (u.prototype.getServiceRequestDetails = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/service_request_details',
                serviceType: 'rosapi/ServiceRequestDetails'
              }),
              s = new a({ type: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e)
                })
          }),
          (u.prototype.getServiceResponseDetails = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/service_response_details',
                serviceType: 'rosapi/ServiceResponseDetails'
              }),
              s = new a({ type: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e)
                })
          }),
          (u.prototype.getNodes = function (e, t) {
            var i = new o({ ros: this, name: '/rosapi/nodes', serviceType: 'rosapi/Nodes' }),
              n = new a()
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t.nodes)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t.nodes)
                })
          }),
          (u.prototype.getNodeDetails = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/node_details',
                serviceType: 'rosapi/NodeDetails'
              }),
              s = new a({ node: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.subscribing, e.publishing, e.services)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e)
                })
          }),
          (u.prototype.getParams = function (e, t) {
            var i = new o({
                ros: this,
                name: '/rosapi/get_param_names',
                serviceType: 'rosapi/GetParamNames'
              }),
              n = new a()
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t.names)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t.names)
                })
          }),
          (u.prototype.getTopicType = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/topic_type',
                serviceType: 'rosapi/TopicType'
              }),
              s = new a({ topic: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.type)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e.type)
                })
          }),
          (u.prototype.getServiceType = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/service_type',
                serviceType: 'rosapi/ServiceType'
              }),
              s = new a({ service: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.type)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e.type)
                })
          }),
          (u.prototype.getMessageDetails = function (e, t, i) {
            var n = new o({
                ros: this,
                name: '/rosapi/message_details',
                serviceType: 'rosapi/MessageDetails'
              }),
              s = new a({ type: e })
            'function' == typeof i
              ? n.callService(
                  s,
                  function (e) {
                    t(e.typedefs)
                  },
                  function (e) {
                    i(e)
                  }
                )
              : n.callService(s, function (e) {
                  t(e.typedefs)
                })
          }),
          (u.prototype.decodeTypeDefs = function (e) {
            var t = this,
              i = function (e, n) {
                for (var s = {}, r = 0; r < e.fieldnames.length; r++) {
                  var o = e.fieldarraylen[r],
                    a = e.fieldnames[r],
                    c = e.fieldtypes[r]
                  if (-1 === c.indexOf('/')) -1 === o ? (s[a] = c) : (s[a] = [c])
                  else {
                    for (var l = !1, u = 0; u < n.length; u++)
                      if (n[u].type.toString() === c.toString()) {
                        l = n[u]
                        break
                      }
                    if (l) {
                      var h = i(l, n)
                      ;-1 === o || (s[a] = [h])
                    } else t.emit('error', 'Cannot find ' + c + ' in decodeTypeDefs')
                  }
                }
                return s
              }
            return i(e[0], e)
          }),
          (u.prototype.getTopicsAndRawTypes = function (e, t) {
            var i = new o({
                ros: this,
                name: '/rosapi/topics_and_raw_types',
                serviceType: 'rosapi/TopicsAndRawTypes'
              }),
              n = new a()
            'function' == typeof t
              ? i.callService(
                  n,
                  function (t) {
                    e(t)
                  },
                  function (e) {
                    t(e)
                  }
                )
              : i.callService(n, function (t) {
                  e(t)
                })
          }),
          (t.exports = u)
      },
      {
        '../util/workerSocket': 49,
        './Service': 18,
        './ServiceRequest': 19,
        './SocketAdapter.js': 21,
        eventemitter2: 2,
        'object-assign': 3,
        ws: 46
      }
    ],
    18: [
      function (e, t, i) {
        var n = e('./ServiceResponse')
        e('./ServiceRequest')
        var s = e('eventemitter2').EventEmitter2
        function r(e) {
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.name = e.name),
            (this.serviceType = e.serviceType),
            (this.isAdvertised = !1),
            (this._serviceCallback = null)
        }
        ;(r.prototype.__proto__ = s.prototype),
          (r.prototype.callService = function (e, t, i) {
            if (!this.isAdvertised) {
              var s = 'call_service:' + this.name + ':' + ++this.ros.idCounter
              ;(t || i) &&
                this.ros.once(s, function (e) {
                  void 0 !== e.result && !1 === e.result
                    ? 'function' == typeof i && i(e.values)
                    : 'function' == typeof t && t(new n(e.values))
                })
              var r = {
                op: 'call_service',
                id: s,
                service: this.name,
                type: this.serviceType,
                args: e
              }
              this.ros.callOnConnection(r)
            }
          }),
          (r.prototype.advertise = function (e) {
            !this.isAdvertised &&
              'function' == typeof e &&
              ((this._serviceCallback = e),
              this.ros.on(this.name, this._serviceResponse.bind(this)),
              this.ros.callOnConnection({
                op: 'advertise_service',
                type: this.serviceType,
                service: this.name
              }),
              (this.isAdvertised = !0))
          }),
          (r.prototype.unadvertise = function () {
            this.isAdvertised &&
              (this.ros.callOnConnection({ op: 'unadvertise_service', service: this.name }),
              (this.isAdvertised = !1))
          }),
          (r.prototype._serviceResponse = function (e) {
            var t = {},
              i = this._serviceCallback(e.args, t),
              s = { op: 'service_response', service: this.name, values: new n(t), result: i }
            e.id && (s.id = e.id), this.ros.callOnConnection(s)
          }),
          (t.exports = r)
      },
      { './ServiceRequest': 19, './ServiceResponse': 20, eventemitter2: 2 }
    ],
    19: [
      function (e, t, i) {
        var n = e('object-assign')
        t.exports = function e(t) {
          n(this, t)
        }
      },
      { 'object-assign': 3 }
    ],
    20: [
      function (e, t, i) {
        var n = e('object-assign')
        t.exports = function e(t) {
          n(this, t)
        }
      },
      { 'object-assign': 3 }
    ],
    21: [
      function (e, t, i) {
        'use strict'
        var n = e('../util/decompressPng'),
          s = e('cbor-js'),
          r = e('../util/cborTypedArrayTags'),
          o = null
        'undefined' != typeof bson && (o = bson().BSON),
          (t.exports = function e(t) {
            var i = null
            function a(e) {
              'publish' === e.op
                ? t.emit(e.topic, e.msg)
                : 'service_response' === e.op
                ? t.emit(e.id, e)
                : 'call_service' === e.op
                ? t.emit(e.service, e)
                : 'status' === e.op && (e.id ? t.emit('status:' + e.id, e) : t.emit('status', e))
            }
            function c(e, t) {
              'png' === e.op ? n(e.data, t) : t(e)
            }
            return (
              t.transportOptions.decoder && (i = t.transportOptions.decoder),
              {
                onopen: function e(i) {
                  ;(t.isConnected = !0), t.emit('connection', i)
                },
                onclose: function e(i) {
                  ;(t.isConnected = !1), t.emit('close', i)
                },
                onerror: function e(i) {
                  t.emit('error', i)
                },
                onmessage: function e(t) {
                  i
                    ? i(t.data, function (e) {
                        a(e)
                      })
                    : 'undefined' != typeof Blob && t.data instanceof Blob
                    ? !(function e(t, i) {
                        if (!o) throw 'Cannot process BSON encoded message without BSON header.'
                        var n = new FileReader()
                        ;(n.onload = function () {
                          var e = new Uint8Array(this.result)
                          i(o.deserialize(e))
                        }),
                          n.readAsArrayBuffer(t)
                      })(t.data, function (e) {
                        c(e, a)
                      })
                    : t.data instanceof ArrayBuffer
                    ? a(s.decode(t.data, r))
                    : c(JSON.parse('string' == typeof t ? t : t.data), a)
                }
              }
            )
          })
      },
      { '../util/cborTypedArrayTags': 44, '../util/decompressPng': 48, 'cbor-js': 1 }
    ],
    22: [
      function (e, t, i) {
        var n = e('eventemitter2').EventEmitter2,
          s = e('./Message')
        function r(e) {
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.name = e.name),
            (this.messageType = e.messageType),
            (this.isAdvertised = !1),
            (this.compression = e.compression || 'none'),
            (this.throttle_rate = e.throttle_rate || 0),
            (this.latch = e.latch || !1),
            (this.queue_size = e.queue_size || 100),
            (this.queue_length = e.queue_length || 0),
            (this.reconnect_on_close = void 0 === e.reconnect_on_close || e.reconnect_on_close),
            this.compression &&
              'png' !== this.compression &&
              'cbor' !== this.compression &&
              'cbor-raw' !== this.compression &&
              'none' !== this.compression &&
              (this.emit(
                'warning',
                this.compression + ' compression is not supported. No compression will be used.'
              ),
              (this.compression = 'none')),
            this.throttle_rate < 0 &&
              (this.emit('warning', this.throttle_rate + ' is not allowed. Set to 0'),
              (this.throttle_rate = 0))
          var t = this
          this.reconnect_on_close
            ? (this.callForSubscribeAndAdvertise = function (e) {
                t.ros.callOnConnection(e),
                  (t.waitForReconnect = !1),
                  (t.reconnectFunc = function () {
                    t.waitForReconnect ||
                      ((t.waitForReconnect = !0),
                      t.ros.callOnConnection(e),
                      t.ros.once('connection', function () {
                        t.waitForReconnect = !1
                      }))
                  }),
                  t.ros.on('close', t.reconnectFunc)
              })
            : (this.callForSubscribeAndAdvertise = this.ros.callOnConnection),
            (this._messageCallback = function (e) {
              t.emit('message', new s(e))
            })
        }
        ;(r.prototype.__proto__ = n.prototype),
          (r.prototype.subscribe = function (e) {
            'function' == typeof e && this.on('message', e),
              !this.subscribeId &&
                (this.ros.on(this.name, this._messageCallback),
                (this.subscribeId = 'subscribe:' + this.name + ':' + ++this.ros.idCounter),
                this.callForSubscribeAndAdvertise({
                  op: 'subscribe',
                  id: this.subscribeId,
                  type: this.messageType,
                  topic: this.name,
                  compression: this.compression,
                  throttle_rate: this.throttle_rate,
                  queue_length: this.queue_length
                }))
          }),
          (r.prototype.unsubscribe = function (e) {
            ;(!e || (this.off('message', e), !this.listeners('message').length)) &&
              this.subscribeId &&
              (this.ros.off(this.name, this._messageCallback),
              this.reconnect_on_close && this.ros.off('close', this.reconnectFunc),
              this.emit('unsubscribe'),
              this.ros.callOnConnection({
                op: 'unsubscribe',
                id: this.subscribeId,
                topic: this.name
              }),
              (this.subscribeId = null))
          }),
          (r.prototype.advertise = function () {
            if (
              !this.isAdvertised &&
              ((this.advertiseId = 'advertise:' + this.name + ':' + ++this.ros.idCounter),
              this.callForSubscribeAndAdvertise({
                op: 'advertise',
                id: this.advertiseId,
                type: this.messageType,
                topic: this.name,
                latch: this.latch,
                queue_size: this.queue_size
              }),
              (this.isAdvertised = !0),
              !this.reconnect_on_close)
            ) {
              var e = this
              this.ros.on('close', function () {
                e.isAdvertised = !1
              })
            }
          }),
          (r.prototype.unadvertise = function () {
            this.isAdvertised &&
              (this.reconnect_on_close && this.ros.off('close', this.reconnectFunc),
              this.emit('unadvertise'),
              this.ros.callOnConnection({
                op: 'unadvertise',
                id: this.advertiseId,
                topic: this.name
              }),
              (this.isAdvertised = !1))
          }),
          (r.prototype.publish = function (e) {
            this.isAdvertised || this.advertise(), this.ros.idCounter++
            var t = {
              op: 'publish',
              id: 'publish:' + this.name + ':' + this.ros.idCounter,
              topic: this.name,
              msg: e,
              latch: this.latch
            }
            this.ros.callOnConnection(t)
          }),
          (t.exports = r)
      },
      { './Message': 15, eventemitter2: 2 }
    ],
    23: [
      function (e, t, i) {
        var n = e('../mixin'),
          s = (t.exports = {
            Ros: e('./Ros'),
            Topic: e('./Topic'),
            Message: e('./Message'),
            Param: e('./Param'),
            Service: e('./Service'),
            ServiceRequest: e('./ServiceRequest'),
            ServiceResponse: e('./ServiceResponse')
          })
        n(s.Ros, ['Param', 'Service', 'Topic'], s)
      },
      {
        '../mixin': 29,
        './Message': 15,
        './Param': 16,
        './Ros': 17,
        './Service': 18,
        './ServiceRequest': 19,
        './ServiceResponse': 20,
        './Topic': 22
      }
    ],
    24: [
      function (e, t, i) {
        var n = e('./Vector3'),
          s = e('./Quaternion')
        function r(e) {
          ;(e = e || {}),
            (this.position = new n(e.position)),
            (this.orientation = new s(e.orientation))
        }
        ;(r.prototype.applyTransform = function (e) {
          this.position.multiplyQuaternion(e.rotation), this.position.add(e.translation)
          var t = e.rotation.clone()
          t.multiply(this.orientation), (this.orientation = t)
        }),
          (r.prototype.clone = function () {
            return new r(this)
          }),
          (r.prototype.multiply = function (e) {
            var t = e.clone()
            return t.applyTransform({ rotation: this.orientation, translation: this.position }), t
          }),
          (r.prototype.getInverse = function () {
            var e = this.clone()
            return (
              e.orientation.invert(),
              e.position.multiplyQuaternion(e.orientation),
              (e.position.x *= -1),
              (e.position.y *= -1),
              (e.position.z *= -1),
              e
            )
          }),
          (t.exports = r)
      },
      { './Quaternion': 25, './Vector3': 27 }
    ],
    25: [
      function (e, t, i) {
        function n(e) {
          ;(e = e || {}),
            (this.x = e.x || 0),
            (this.y = e.y || 0),
            (this.z = e.z || 0),
            (this.w = 'number' == typeof e.w ? e.w : 1)
        }
        ;(n.prototype.conjugate = function () {
          ;(this.x *= -1), (this.y *= -1), (this.z *= -1)
        }),
          (n.prototype.norm = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
          }),
          (n.prototype.normalize = function () {
            var e = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
            0 === e
              ? ((this.x = 0), (this.y = 0), (this.z = 0), (this.w = 1))
              : ((e = 1 / e),
                (this.x = this.x * e),
                (this.y = this.y * e),
                (this.z = this.z * e),
                (this.w = this.w * e))
          }),
          (n.prototype.invert = function () {
            this.conjugate(), this.normalize()
          }),
          (n.prototype.multiply = function (e) {
            var t = this.x * e.w + this.y * e.z - this.z * e.y + this.w * e.x,
              i = -this.x * e.z + this.y * e.w + this.z * e.x + this.w * e.y,
              n = this.x * e.y - this.y * e.x + this.z * e.w + this.w * e.z,
              s = -this.x * e.x - this.y * e.y - this.z * e.z + this.w * e.w
            ;(this.x = t), (this.y = i), (this.z = n), (this.w = s)
          }),
          (n.prototype.clone = function () {
            return new n(this)
          }),
          (t.exports = n)
      },
      {}
    ],
    26: [
      function (e, t, i) {
        var n = e('./Vector3'),
          s = e('./Quaternion')
        function r(e) {
          ;(e = e || {}),
            (this.translation = new n(e.translation)),
            (this.rotation = new s(e.rotation))
        }
        ;(r.prototype.clone = function () {
          return new r(this)
        }),
          (t.exports = r)
      },
      { './Quaternion': 25, './Vector3': 27 }
    ],
    27: [
      function (e, t, i) {
        function n(e) {
          ;(e = e || {}), (this.x = e.x || 0), (this.y = e.y || 0), (this.z = e.z || 0)
        }
        ;(n.prototype.add = function (e) {
          ;(this.x += e.x), (this.y += e.y), (this.z += e.z)
        }),
          (n.prototype.subtract = function (e) {
            ;(this.x -= e.x), (this.y -= e.y), (this.z -= e.z)
          }),
          (n.prototype.multiplyQuaternion = function (e) {
            var t = e.w * this.x + e.y * this.z - e.z * this.y,
              i = e.w * this.y + e.z * this.x - e.x * this.z,
              n = e.w * this.z + e.x * this.y - e.y * this.x,
              s = -e.x * this.x - e.y * this.y - e.z * this.z
            ;(this.x = t * e.w + -(s * e.x) + -(i * e.z) - -(n * e.y)),
              (this.y = i * e.w + -(s * e.y) + -(n * e.x) - -(t * e.z)),
              (this.z = n * e.w + -(s * e.z) + -(t * e.y) - -(i * e.x))
          }),
          (n.prototype.clone = function () {
            return new n(this)
          }),
          (t.exports = n)
      },
      {}
    ],
    28: [
      function (e, t, i) {
        t.exports = {
          Pose: e('./Pose'),
          Quaternion: e('./Quaternion'),
          Transform: e('./Transform'),
          Vector3: e('./Vector3')
        }
      },
      { './Pose': 24, './Quaternion': 25, './Transform': 26, './Vector3': 27 }
    ],
    29: [
      function (e, t, i) {
        t.exports = function (e, t, i) {
          t.forEach(function (t) {
            var n = i[t]
            e.prototype[t] = function (e) {
              return (e.ros = this), new n(e)
            }
          })
        }
      },
      {}
    ],
    30: [
      function (e, t, i) {
        var n = e('../actionlib/ActionClient'),
          s = e('../actionlib/Goal'),
          r = e('../core/Service.js'),
          o = e('../core/ServiceRequest.js'),
          a = e('../core/Topic.js'),
          c = e('../math/Transform')
        function l(e) {
          ;(e = e || {}),
            (this.ros = e.ros),
            (this.fixedFrame = e.fixedFrame || '/base_link'),
            (this.angularThres = e.angularThres || 2),
            (this.transThres = e.transThres || 0.01),
            (this.rate = e.rate || 10),
            (this.updateDelay = e.updateDelay || 50)
          var t = e.topicTimeout || 2,
            i = Math.floor(t)
          ;(this.topicTimeout = { secs: i, nsecs: Math.floor((t - i) * 1e9) }),
            (this.serverName = e.serverName || '/tf2_web_republisher'),
            (this.repubServiceName = e.repubServiceName || '/republish_tfs'),
            (this.currentGoal = !1),
            (this.currentTopic = !1),
            (this.frameInfos = {}),
            (this.republisherUpdateRequested = !1),
            (this._subscribeCB = null),
            (this._isDisposed = !1),
            (this.actionClient = new n({
              ros: e.ros,
              serverName: this.serverName,
              actionName: 'tf2_web_republisher/TFSubscriptionAction',
              omitStatus: !0,
              omitResult: !0
            })),
            (this.serviceClient = new r({
              ros: e.ros,
              name: this.repubServiceName,
              serviceType: 'tf2_web_republisher/RepublishTFs'
            }))
        }
        ;(l.prototype.processTFArray = function (e) {
          e.transforms.forEach(function (e) {
            var t = e.child_frame_id
            '/' === t[0] && (t = t.substring(1))
            var i = this.frameInfos[t]
            i &&
              ((i.transform = new c({
                translation: e.transform.translation,
                rotation: e.transform.rotation
              })),
              i.cbs.forEach(function (e) {
                e(i.transform)
              }))
          }, this)
        }),
          (l.prototype.updateGoal = function () {
            var e = {
              source_frames: Object.keys(this.frameInfos),
              target_frame: this.fixedFrame,
              angular_thres: this.angularThres,
              trans_thres: this.transThres,
              rate: this.rate
            }
            if (this.ros.groovyCompatibility)
              this.currentGoal && this.currentGoal.cancel(),
                (this.currentGoal = new s({ actionClient: this.actionClient, goalMessage: e })),
                this.currentGoal.on('feedback', this.processTFArray.bind(this)),
                this.currentGoal.send()
            else {
              e.timeout = this.topicTimeout
              var t = new o(e)
              this.serviceClient.callService(t, this.processResponse.bind(this))
            }
            this.republisherUpdateRequested = !1
          }),
          (l.prototype.processResponse = function (e) {
            !this._isDisposed &&
              (this.currentTopic && this.currentTopic.unsubscribe(this._subscribeCB),
              (this.currentTopic = new a({
                ros: this.ros,
                name: e.topic_name,
                messageType: 'tf2_web_republisher/TFArray'
              })),
              (this._subscribeCB = this.processTFArray.bind(this)),
              this.currentTopic.subscribe(this._subscribeCB))
          }),
          (l.prototype.subscribe = function (e, t) {
            '/' === e[0] && (e = e.substring(1)),
              this.frameInfos[e]
                ? this.frameInfos[e].transform && t(this.frameInfos[e].transform)
                : ((this.frameInfos[e] = { cbs: [] }),
                  this.republisherUpdateRequested ||
                    (setTimeout(this.updateGoal.bind(this), this.updateDelay),
                    (this.republisherUpdateRequested = !0))),
              this.frameInfos[e].cbs.push(t)
          }),
          (l.prototype.unsubscribe = function (e, t) {
            '/' === e[0] && (e = e.substring(1))
            for (var i = this.frameInfos[e], n = (i && i.cbs) || [], s = n.length; s--; )
              n[s] === t && n.splice(s, 1)
            ;(t && 0 !== n.length) || delete this.frameInfos[e]
          }),
          (l.prototype.dispose = function () {
            ;(this._isDisposed = !0),
              this.actionClient.dispose(),
              this.currentTopic && this.currentTopic.unsubscribe(this._subscribeCB)
          }),
          (t.exports = l)
      },
      {
        '../actionlib/ActionClient': 10,
        '../actionlib/Goal': 12,
        '../core/Service.js': 18,
        '../core/ServiceRequest.js': 19,
        '../core/Topic.js': 22,
        '../math/Transform': 26
      }
    ],
    31: [
      function (e, t, i) {
        var n = e('../core/Ros'),
          s = e('../mixin'),
          r = (t.exports = { TFClient: e('./TFClient') })
        s(n, ['TFClient'], r)
      },
      { '../core/Ros': 17, '../mixin': 29, './TFClient': 30 }
    ],
    32: [
      function (e, t, i) {
        var n = e('../math/Vector3'),
          s = e('./UrdfTypes')
        t.exports = function e(t) {
          ;(this.dimension = null), (this.type = s.URDF_BOX)
          var i = t.xml.getAttribute('size').split(' ')
          this.dimension = new n({ x: parseFloat(i[0]), y: parseFloat(i[1]), z: parseFloat(i[2]) })
        }
      },
      { '../math/Vector3': 27, './UrdfTypes': 41 }
    ],
    33: [
      function (e, t, i) {
        t.exports = function e(t) {
          var i = t.xml.getAttribute('rgba').split(' ')
          ;(this.r = parseFloat(i[0])),
            (this.g = parseFloat(i[1])),
            (this.b = parseFloat(i[2])),
            (this.a = parseFloat(i[3]))
        }
      },
      {}
    ],
    34: [
      function (e, t, i) {
        var n = e('./UrdfTypes')
        t.exports = function e(t) {
          ;(this.type = n.URDF_CYLINDER),
            (this.length = parseFloat(t.xml.getAttribute('length'))),
            (this.radius = parseFloat(t.xml.getAttribute('radius')))
        }
      },
      { './UrdfTypes': 41 }
    ],
    35: [
      function (e, t, i) {
        var n = e('../math/Pose'),
          s = e('../math/Vector3'),
          r = e('../math/Quaternion')
        t.exports = function e(t) {
          ;(this.name = t.xml.getAttribute('name')), (this.type = t.xml.getAttribute('type'))
          var i = t.xml.getElementsByTagName('parent')
          i.length > 0 && (this.parent = i[0].getAttribute('link'))
          var o = t.xml.getElementsByTagName('child')
          o.length > 0 && (this.child = o[0].getAttribute('link'))
          var a = t.xml.getElementsByTagName('limit')
          a.length > 0 &&
            ((this.minval = parseFloat(a[0].getAttribute('lower'))),
            (this.maxval = parseFloat(a[0].getAttribute('upper'))))
          var c = t.xml.getElementsByTagName('origin')
          if (0 === c.length) this.origin = new n()
          else {
            var l = c[0].getAttribute('xyz'),
              u = new s()
            l &&
              ((l = l.split(' ')),
              (u = new s({ x: parseFloat(l[0]), y: parseFloat(l[1]), z: parseFloat(l[2]) })))
            var h = c[0].getAttribute('rpy'),
              f = new r()
            if (h) {
              var p = parseFloat((h = h.split(' '))[0]),
                m = parseFloat(h[1]),
                v = parseFloat(h[2]),
                d = p / 2,
                y = m / 2,
                g = v / 2
              ;(f = new r({
                x:
                  Math.sin(d) * Math.cos(y) * Math.cos(g) - Math.cos(d) * Math.sin(y) * Math.sin(g),
                y:
                  Math.cos(d) * Math.sin(y) * Math.cos(g) + Math.sin(d) * Math.cos(y) * Math.sin(g),
                z:
                  Math.cos(d) * Math.cos(y) * Math.sin(g) - Math.sin(d) * Math.sin(y) * Math.cos(g),
                w: Math.cos(d) * Math.cos(y) * Math.cos(g) + Math.sin(d) * Math.sin(y) * Math.sin(g)
              })).normalize()
            }
            this.origin = new n({ position: u, orientation: f })
          }
        }
      },
      { '../math/Pose': 24, '../math/Quaternion': 25, '../math/Vector3': 27 }
    ],
    36: [
      function (e, t, i) {
        var n = e('./UrdfVisual')
        t.exports = function e(t) {
          ;(this.name = t.xml.getAttribute('name')), (this.visuals = [])
          for (var i = t.xml.getElementsByTagName('visual'), s = 0; s < i.length; s++)
            this.visuals.push(new n({ xml: i[s] }))
        }
      },
      { './UrdfVisual': 42 }
    ],
    37: [
      function (e, t, i) {
        var n = e('./UrdfColor')
        function s(e) {
          ;(this.textureFilename = null),
            (this.color = null),
            (this.name = e.xml.getAttribute('name'))
          var t = e.xml.getElementsByTagName('texture')
          t.length > 0 && (this.textureFilename = t[0].getAttribute('filename'))
          var i = e.xml.getElementsByTagName('color')
          i.length > 0 && (this.color = new n({ xml: i[0] }))
        }
        s.prototype.isLink = function () {
          return null === this.color && null === this.textureFilename
        }
        var r = e('object-assign')
        ;(s.prototype.assign = function (e) {
          return r(this, e)
        }),
          (t.exports = s)
      },
      { './UrdfColor': 33, 'object-assign': 3 }
    ],
    38: [
      function (e, t, i) {
        var n = e('../math/Vector3'),
          s = e('./UrdfTypes')
        t.exports = function e(t) {
          ;(this.scale = null),
            (this.type = s.URDF_MESH),
            (this.filename = t.xml.getAttribute('filename'))
          var i = t.xml.getAttribute('scale')
          if (i) {
            var r = i.split(' ')
            this.scale = new n({ x: parseFloat(r[0]), y: parseFloat(r[1]), z: parseFloat(r[2]) })
          }
        }
      },
      { '../math/Vector3': 27, './UrdfTypes': 41 }
    ],
    39: [
      function (e, t, i) {
        var n = e('./UrdfMaterial'),
          s = e('./UrdfLink'),
          r = e('./UrdfJoint'),
          o = e('@xmldom/xmldom').DOMParser
        t.exports = function e(t) {
          var i = (t = t || {}).xml,
            a = t.string
          ;(this.materials = {}),
            (this.links = {}),
            (this.joints = {}),
            a && (i = new o().parseFromString(a, 'text/xml'))
          var c = i.documentElement
          this.name = c.getAttribute('name')
          for (var l = c.childNodes, u = 0; u < l.length; u++) {
            var h = l[u]
            if ('material' === h.tagName) {
              var f = new n({ xml: h })
              void 0 !== this.materials[f.name]
                ? this.materials[f.name].isLink()
                  ? this.materials[f.name].assign(f)
                  : console.warn('Material ' + f.name + 'is not unique.')
                : (this.materials[f.name] = f)
            } else if ('link' === h.tagName) {
              var p = new s({ xml: h })
              if (void 0 !== this.links[p.name]) console.warn('Link ' + p.name + ' is not unique.')
              else {
                for (var m = 0; m < p.visuals.length; m++) {
                  var v = p.visuals[m].material
                  null !== v &&
                    v.name &&
                    (void 0 !== this.materials[v.name]
                      ? (p.visuals[m].material = this.materials[v.name])
                      : (this.materials[v.name] = v))
                }
                this.links[p.name] = p
              }
            } else if ('joint' === h.tagName) {
              var d = new r({ xml: h })
              this.joints[d.name] = d
            }
          }
        }
      },
      { './UrdfJoint': 35, './UrdfLink': 36, './UrdfMaterial': 37, '@xmldom/xmldom': 45 }
    ],
    40: [
      function (e, t, i) {
        var n = e('./UrdfTypes')
        t.exports = function e(t) {
          ;(this.type = n.URDF_SPHERE), (this.radius = parseFloat(t.xml.getAttribute('radius')))
        }
      },
      { './UrdfTypes': 41 }
    ],
    41: [
      function (e, t, i) {
        t.exports = { URDF_SPHERE: 0, URDF_BOX: 1, URDF_CYLINDER: 2, URDF_MESH: 3 }
      },
      {}
    ],
    42: [
      function (e, t, i) {
        var n = e('../math/Pose'),
          s = e('../math/Vector3'),
          r = e('../math/Quaternion'),
          o = e('./UrdfCylinder'),
          a = e('./UrdfBox'),
          c = e('./UrdfMaterial'),
          l = e('./UrdfMesh'),
          u = e('./UrdfSphere')
        t.exports = function e(t) {
          var i = t.xml
          ;(this.origin = null),
            (this.geometry = null),
            (this.material = null),
            (this.name = t.xml.getAttribute('name'))
          var h = i.getElementsByTagName('origin')
          if (0 === h.length) this.origin = new n()
          else {
            var f = h[0].getAttribute('xyz'),
              p = new s()
            f &&
              ((f = f.split(' ')),
              (p = new s({ x: parseFloat(f[0]), y: parseFloat(f[1]), z: parseFloat(f[2]) })))
            var m = h[0].getAttribute('rpy'),
              v = new r()
            if (m) {
              var d = parseFloat((m = m.split(' '))[0]),
                y = parseFloat(m[1]),
                g = parseFloat(m[2]),
                $ = d / 2,
                b = y / 2,
                w = g / 2
              ;(v = new r({
                x:
                  Math.sin($) * Math.cos(b) * Math.cos(w) - Math.cos($) * Math.sin(b) * Math.sin(w),
                y:
                  Math.cos($) * Math.sin(b) * Math.cos(w) + Math.sin($) * Math.cos(b) * Math.sin(w),
                z:
                  Math.cos($) * Math.cos(b) * Math.sin(w) - Math.sin($) * Math.sin(b) * Math.cos(w),
                w: Math.cos($) * Math.cos(b) * Math.cos(w) + Math.sin($) * Math.sin(b) * Math.sin(w)
              })).normalize()
            }
            this.origin = new n({ position: p, orientation: v })
          }
          var _ = i.getElementsByTagName('geometry')
          if (_.length > 0) {
            for (var x = _[0], T = null, k = 0; k < x.childNodes.length; k++) {
              var L = x.childNodes[k]
              if (1 === L.nodeType) {
                T = L
                break
              }
            }
            var S = T.nodeName
            'sphere' === S
              ? (this.geometry = new u({ xml: T }))
              : 'box' === S
              ? (this.geometry = new a({ xml: T }))
              : 'cylinder' === S
              ? (this.geometry = new o({ xml: T }))
              : 'mesh' === S
              ? (this.geometry = new l({ xml: T }))
              : console.warn('Unknown geometry type ' + S)
          }
          var U = i.getElementsByTagName('material')
          U.length > 0 && (this.material = new c({ xml: U[0] }))
        }
      },
      {
        '../math/Pose': 24,
        '../math/Quaternion': 25,
        '../math/Vector3': 27,
        './UrdfBox': 32,
        './UrdfCylinder': 34,
        './UrdfMaterial': 37,
        './UrdfMesh': 38,
        './UrdfSphere': 40
      }
    ],
    43: [
      function (e, t, i) {
        t.exports = e('object-assign')(
          {
            UrdfBox: e('./UrdfBox'),
            UrdfColor: e('./UrdfColor'),
            UrdfCylinder: e('./UrdfCylinder'),
            UrdfLink: e('./UrdfLink'),
            UrdfMaterial: e('./UrdfMaterial'),
            UrdfMesh: e('./UrdfMesh'),
            UrdfModel: e('./UrdfModel'),
            UrdfSphere: e('./UrdfSphere'),
            UrdfVisual: e('./UrdfVisual')
          },
          e('./UrdfTypes')
        )
      },
      {
        './UrdfBox': 32,
        './UrdfColor': 33,
        './UrdfCylinder': 34,
        './UrdfLink': 36,
        './UrdfMaterial': 37,
        './UrdfMesh': 38,
        './UrdfModel': 39,
        './UrdfSphere': 40,
        './UrdfTypes': 41,
        './UrdfVisual': 42,
        'object-assign': 3
      }
    ],
    44: [
      function (e, t, i) {
        'use strict'
        var n = !1
        function s() {
          n ||
            ((n = !0),
            console.warn(
              'CBOR 64-bit integer array values may lose precision. No further warnings.'
            ))
        }
        var r = {
            64: Uint8Array,
            69: Uint16Array,
            70: Uint32Array,
            72: Int8Array,
            77: Int16Array,
            78: Int32Array,
            85: Float32Array,
            86: Float64Array
          },
          o = {
            71: function e(t) {
              s()
              for (
                var i = t.byteLength,
                  n = t.byteOffset,
                  r = i / 8,
                  o = t.buffer.slice(n, n + i),
                  a = new Uint32Array(o),
                  c = Array(r),
                  l = 0;
                l < r;
                l++
              ) {
                var u = 2 * l,
                  h = a[u],
                  f = a[u + 1]
                c[l] = h + 4294967296 * f
              }
              return c
            },
            79: function e(t) {
              s()
              for (
                var i = t.byteLength,
                  n = t.byteOffset,
                  r = i / 8,
                  o = t.buffer.slice(n, n + i),
                  a = new Uint32Array(o),
                  c = new Int32Array(o),
                  l = Array(r),
                  u = 0;
                u < r;
                u++
              ) {
                var h = 2 * u,
                  f = a[h],
                  p = c[h + 1]
                l[u] = f + 4294967296 * p
              }
              return l
            }
          }
        void 0 !== t &&
          t.exports &&
          (t.exports = function e(t, i) {
            if (i in r) {
              var n,
                s,
                a,
                c,
                l,
                u = r[i]
              return (
                (n = t),
                (s = u),
                (a = n.byteLength),
                (c = n.byteOffset),
                (l = n.buffer.slice(c, c + a)),
                new s(l)
              )
            }
            return i in o ? o[i](t) : t
          })
      },
      {}
    ],
    45: [
      function (e, t, i) {
        ;(i.DOMImplementation = window.DOMImplementation),
          (i.XMLSerializer = window.XMLSerializer),
          (i.DOMParser = window.DOMParser)
      },
      {}
    ],
    46: [
      function (e, t, i) {
        t.exports = 'undefined' != typeof window ? window.WebSocket : WebSocket
      },
      {}
    ],
    47: [
      function (e, t, i) {
        t.exports = function e() {
          return document.createElement('canvas')
        }
      },
      {}
    ],
    48: [
      function (e, t, i) {
        'use strict'
        var n = e('canvas'),
          s = n.Image || window.Image
        t.exports = function e(t, i) {
          var r = new s()
          ;(r.onload = function () {
            var e = new n(),
              t = e.getContext('2d')
            ;(e.width = r.width),
              (e.height = r.height),
              (t.imageSmoothingEnabled = !1),
              (t.webkitImageSmoothingEnabled = !1),
              (t.mozImageSmoothingEnabled = !1),
              t.drawImage(r, 0, 0)
            for (
              var s = t.getImageData(0, 0, r.width, r.height).data, o = '', a = 0;
              a < s.length;
              a += 4
            )
              o += String.fromCharCode(s[a], s[a + 1], s[a + 2])
            i(JSON.parse(o))
          }),
            (r.src = 'data:image/png;base64,' + t)
        }
      },
      { canvas: 47 }
    ],
    49: [
      function (e, t, i) {
        try {
          var n = e('webworkify')
        } catch (s) {
          var n = e('webworkify-webpack')
        }
        var r = e('./workerSocketImpl')
        function o(e) {
          ;(this.socket_ = n(r)),
            this.socket_.addEventListener('message', this.handleWorkerMessage_.bind(this)),
            this.socket_.postMessage({ uri: e })
        }
        ;(o.prototype.handleWorkerMessage_ = function (e) {
          var t = e.data
          if (t instanceof ArrayBuffer || 'string' == typeof t) this.onmessage(e)
          else {
            var i = t.type
            if ('close' === i) this.onclose(null)
            else if ('open' === i) this.onopen(null)
            else if ('error' === i) this.onerror(null)
            else throw 'Unknown message from workersocket'
          }
        }),
          (o.prototype.send = function (e) {
            this.socket_.postMessage(e)
          }),
          (o.prototype.close = function () {
            this.socket_.postMessage({ close: !0 })
          }),
          (t.exports = o)
      },
      { './workerSocketImpl': 50, webworkify: 7, 'webworkify-webpack': 6 }
    ],
    50: [
      function (e, t, i) {
        var n = n || e('ws')
        t.exports = function (e) {
          var t = null
          function i(t) {
            var i = t.data
            i instanceof ArrayBuffer ? e.postMessage(i, [i]) : e.postMessage(i)
          }
          function s(t) {
            e.postMessage({ type: t.type })
          }
          e.addEventListener('message', function (e) {
            var r = e.data
            if ('string' == typeof r) t.send(r)
            else if (r.hasOwnProperty('close')) t.close(), (t = null)
            else if (r.hasOwnProperty('uri')) {
              var o = r.uri
              ;((t = new n(o)).binaryType = 'arraybuffer'),
                (t.onmessage = i),
                (t.onclose = s),
                (t.onopen = s),
                (t.onerror = s)
            } else throw 'Unknown message to WorkerSocket'
          })
        }
      },
      { ws: 46 }
    ]
  },
  {},
  [9]
)

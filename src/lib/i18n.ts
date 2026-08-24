export type Language = 'zh' | 'en'

/**
 * Get custom brand name from environment variable
 * Falls back to 'SpectraWHOIS' if not configured
 */
export function getBrandName(): string {
  return process.env.NEXT_PUBLIC_BRAND_NAME || 'SpectraWHOIS'
}

export const translations = {
  zh: {
    title: getBrandName(),

    // 搜索相关
    searchLabel: '域名',
    searchPlaceholder: 'example.com',
    searchPlaceholderCompact: 'example.com',
    searchButton: '查询',
    searching: '查询中',
    queryingServers: '正在查询注册数据',

    actions: {
      skipToContent: '跳到主要内容',
      returnHome: '返回域名查询',
      newSearch: '重新查询',
      retry: '重试',
      close: '关闭'
    },

    appearance: {
      theme: '外观主题',
      light: '浅色',
      dark: '深色',
      system: '跟随系统'
    },

    // 错误信息
    errors: {
      domainRequired: '请输入域名',
      invalidDomain: '请输入有效的域名',
      domainNotFound: '域名未找到',
      tldNotSupported: '不支持的TLD',
      rdapError: 'RDAP查询错误',
      queryError: '域名查询错误',
      rateLimited: '请求频率受限',
      networkError: '网络错误',
      notFoundInRegistry: '在注册表中未找到域名',
      failedToConnect: '连接服务失败，请重试。'
    },

    // 结果显示
    results: {
      domainInfo: '域名信息',
      status: '状态',
      registrar: '注册商',
      registrationDate: '注册日期',
      expirationDate: '到期日期',
      updatedDate: '更新日期',
      nameServers: '域名服务器',
      contacts: '联系人',
      registrant: '注册人',
      admin: '管理员',
      tech: '技术',
      billing: '账单',
      moreInfo: '更多信息',
      whoisInfo: 'WHOIS信息',
      technicalDetails: '技术详情',
      created: '创建日期',
      updated: '更新日期',
      expires: '到期日期',
      dnssec: 'DNSSEC',
      enabled: '已启用',
      disabled: '已禁用',
      statusUnknown: '状态未知',
      administrative: '管理员',
      technical: '技术',
      registryNotices: '注册表通知',
      viewRawResponse: '查看原始RDAP响应',
      copied: '已复制',
      copyToClipboard: '复制到剪贴板',
      // WHOIS 特有翻译
      noDataAvailable: 'WHOIS数据不可用',
      rawWhoisData: '原始WHOIS数据',
      domainStatus: '域名状态',
      showRawData: '显示原始数据',
      hideRawData: '隐藏原始数据',
      loadingWhoisData: '正在加载WHOIS数据...',
      failedToLoadWhois: '加载WHOIS数据失败',
      whoisQueryFailed: 'WHOIS查询失败',
      retry: '重试',
      whoisRestricted: 'WHOIS查询受限',
      manualCheck: '手动查询',
      restrictionNotice: '注册局禁止自动WHOIS查询。',
      source: '数据来源',
      registrationDetails: '注册信息',
      keyDates: '关键日期',
      overview: '概览',
      entities: '联系人',
      notices: '通知',
      rawData: '原始数据',
      noContactDetails: '注册表未公开联系人信息。',
      openExternalLink: '在新窗口打开',
      lookupFailed: '查询失败'
    },

    // 域名状态翻译
    domainStatus: {
      'client delete prohibited': '禁止客户端删除',
      'client transfer prohibited': '禁止客户端转移',
      'client update prohibited': '禁止客户端更新',
      'client renew prohibited': '禁止客户端续费',
      'client hold': '客户端冻结',
      'server delete prohibited': '禁止服务器端删除',
      'server transfer prohibited': '禁止服务器端转移',
      'server update prohibited': '禁止服务器端更新',
      'server renew prohibited': '禁止服务器端续费',
      'server hold': '服务器端冻结',
      'pending create': '待创建',
      'pending delete': '待删除',
      'pending renew': '待续费',
      'pending restore': '待恢复',
      'pending transfer': '待转移',
      'pending update': '待更新',
      'redemption period': '赎回期',
      'ok': '正常',
      'active': '活跃',
      'inactive': '不活跃',
      'expired': '已过期'
    },

    // 搜索历史
    searchHistory: {
      title: '最近搜索',
      clearAll: '清空',
      remove: '删除',
      clearTitle: '清空搜索记录？',
      clearDescription: '这会删除此设备上的全部本地搜索记录。',
      cancel: '取消',
      confirmClear: '确认清空',
      justNow: '刚刚',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前'
    },

    language: '语言'
  },
  en: {
    title: getBrandName(),

    // Search related
    searchLabel: 'Domain name',
    searchPlaceholder: 'example.com',
    searchPlaceholderCompact: 'example.com',
    searchButton: 'Search',
    searching: 'Searching',
    queryingServers: 'Querying registration data',

    actions: {
      skipToContent: 'Skip to main content',
      returnHome: 'Return to domain lookup',
      newSearch: 'New search',
      retry: 'Try again',
      close: 'Close'
    },

    appearance: {
      theme: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },

    // Error messages
    errors: {
      domainRequired: 'Please enter a domain name',
      invalidDomain: 'Please enter a valid domain name',
      domainNotFound: 'Domain Not Found',
      tldNotSupported: 'TLD Not Supported',
      rdapError: 'RDAP Query Error',
      queryError: 'Domain Query Error',
      rateLimited: 'Rate Limited',
      networkError: 'Network Error',
      notFoundInRegistry: 'Domain not found in registry',
      failedToConnect: 'Failed to connect to the service. Please try again.'
    },

    // Results display
    results: {
      domainInfo: 'Domain Information',
      status: 'Status',
      registrar: 'Registrar',
      registrationDate: 'Registration Date',
      expirationDate: 'Expiration Date',
      updatedDate: 'Updated Date',
      nameServers: 'Name Servers',
      contacts: 'Contacts',
      registrant: 'Registrant',
      admin: 'Administrative',
      tech: 'Technical',
      billing: 'Billing',
      moreInfo: 'More Information',
      whoisInfo: 'WHOIS Information',
      technicalDetails: 'Technical Details',
      created: 'Created',
      updated: 'Updated',
      expires: 'Expires',
      dnssec: 'DNSSEC',
      enabled: 'Enabled',
      disabled: 'Disabled',
      statusUnknown: 'Status unknown',
      administrative: 'Administrative',
      technical: 'Technical',
      registryNotices: 'Registry Notices',
      viewRawResponse: 'View Raw RDAP Response',
      copied: 'Copied',
      copyToClipboard: 'Copy to clipboard',
      // WHOIS specific translations
      noDataAvailable: 'No WHOIS data available',
      rawWhoisData: 'Raw WHOIS Data',
      domainStatus: 'Domain Status',
      showRawData: 'Show Raw Data',
      hideRawData: 'Hide Raw Data',
      loadingWhoisData: 'Loading WHOIS data...',
      failedToLoadWhois: 'Failed to load WHOIS data',
      whoisQueryFailed: 'WHOIS query failed',
      retry: 'Retry',
      whoisRestricted: 'WHOIS Query Restricted',
      manualCheck: 'Manual Check',
      restrictionNotice: ' registry blocks automated WHOIS queries.',
      source: 'Source',
      registrationDetails: 'Registration details',
      keyDates: 'Key dates',
      overview: 'Overview',
      entities: 'Contacts',
      notices: 'Notices',
      rawData: 'Raw data',
      noContactDetails: 'The registry did not publish contact details.',
      openExternalLink: 'Open in a new window',
      lookupFailed: 'Lookup failed'
    },

    // Domain status translations
    domainStatus: {
      'client delete prohibited': 'Client Delete Prohibited',
      'client transfer prohibited': 'Client Transfer Prohibited',
      'client update prohibited': 'Client Update Prohibited',
      'client renew prohibited': 'Client Renew Prohibited',
      'client hold': 'Client Hold',
      'server delete prohibited': 'Server Delete Prohibited',
      'server transfer prohibited': 'Server Transfer Prohibited',
      'server update prohibited': 'Server Update Prohibited',
      'server renew prohibited': 'Server Renew Prohibited',
      'server hold': 'Server Hold',
      'pending create': 'Pending Create',
      'pending delete': 'Pending Delete',
      'pending renew': 'Pending Renew',
      'pending restore': 'Pending Restore',
      'pending transfer': 'Pending Transfer',
      'pending update': 'Pending Update',
      'redemption period': 'Redemption Period',
      'ok': 'OK',
      'active': 'Active',
      'inactive': 'Inactive',
      'expired': 'Expired'
    },

    // Search history
    searchHistory: {
      title: 'Recent Searches',
      clearAll: 'Clear all',
      remove: 'Remove',
      clearTitle: 'Clear search history?',
      clearDescription: 'This removes every locally stored lookup from this device.',
      cancel: 'Cancel',
      confirmClear: 'Clear history',
      justNow: 'Just now',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago'
    },

    language: 'Language'
  }
}

export function getTranslations(lang: Language) {
  return translations[lang]
}

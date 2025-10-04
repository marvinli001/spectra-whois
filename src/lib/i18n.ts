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
    // 主标题和描述
    title: getBrandName(),
    description: '基于RDAP协议的现代域名查询服务，支持全球TLD和国际化域名',
    subtitle: '基于RDAP协议的现代域名查询，支持全球TLD和国际化域名',

    // 搜索相关
    searchPlaceholder: '输入域名（例如：example.com）',
    searchPlaceholderCompact: '搜索域名...',
    searchButton: '查询',
    searching: '查询中',
    queryingServers: '正在查询RDAP服务器...',

    // 功能特性
    features: {
      fastTitle: '闪电般快速',
      fastDesc: '边缘缓存RDAP查询，全球CDN分发，提供即时结果',
      globalTitle: '全球覆盖',
      globalDesc: '通过IANA引导注册表支持所有TLD，完整IDN转换',
      privacyTitle: '隐私优先',
      privacyDesc: '符合RDAP标准，现代隐私标准和结构化数据'
    },

    // 示例域名
    exampleDomains: {
      title: '试试这些示例：',
      domains: ['baidu.com', 'github.com', 'vercel.com']
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
      manualCheckAvailable: '您可以手动查询：',
      manualCheck: '手动查询',
      restrictionNotice: '的注册局实施了严格的WHOIS查询限制，阻止了自动化API访问。这是为了防止滥用和保护隐私。'
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
      justNow: '刚刚',
      minutesAgo: '分钟前',
      hoursAgo: '小时前',
      daysAgo: '天前'
    },

    // 页脚
    footer: '基于RDAP • 使用Next.js 15构建 • 液体玻璃设计',

    // 语言切换
    language: '语言',
    switchToEnglish: 'English',
    switchToChinese: '中文'
  },
  en: {
    // Main title and description
    title: getBrandName(),
    description: 'A modern, fast WHOIS lookup service using RDAP with support for all global TLDs and internationalized domain names',
    subtitle: 'Modern domain lookup powered by RDAP with support for all global TLDs and internationalized domain names',

    // Search related
    searchPlaceholder: 'Enter domain name (e.g., example.com)',
    searchPlaceholderCompact: 'Search domain...',
    searchButton: 'Search',
    searching: 'Searching',
    queryingServers: 'Querying RDAP servers...',

    // Features
    features: {
      fastTitle: 'Lightning Fast',
      fastDesc: 'Edge-cached RDAP queries with global CDN distribution for instant results',
      globalTitle: 'Global Coverage',
      globalDesc: 'Supports all TLDs via IANA bootstrap registry with full IDN conversion',
      privacyTitle: 'Privacy First',
      privacyDesc: 'RDAP compliant with modern privacy standards and structured data'
    },

    // Example domains
    exampleDomains: {
      title: 'Try these examples:',
      domains: ['google.com', 'github.com', 'vercel.com']
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
      manualCheckAvailable: 'You can check manually:',
      manualCheck: 'Manual Check',
      restrictionNotice: ' registry implements strict WHOIS query restrictions that block automated API access. This is to prevent abuse and protect privacy.'
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
      justNow: 'Just now',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago'
    },

    // Footer
    footer: 'Powered by RDAP • Built with Next.js 15 • Liquid Glass Design',

    // Language switching
    language: 'Language',
    switchToEnglish: 'English',
    switchToChinese: '中文'
  }
}

export function getTranslations(lang: Language) {
  return translations[lang]
}
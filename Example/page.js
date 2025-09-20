'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TopNavigation from '../components/TopNavigation'
import BottomActionButton from '../components/BottomActionButton'
import AskAIButton from '../components/AskAIButton'

export default function MyTrackerPage() {
  /* ------------------------------------------------------------------------------------------ */
  // 路由
  const router = useRouter()

  // 状态
  const [activeTab, setActiveTab] = useState('Watchlist')
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 处理返回按钮 - 跳转回home界面
  const handleBack = () => {
    router.push('/')
    router.refresh()
  }

  // 处理搜索按钮
  const handleSearch = () => {
    console.log('Search clicked')
  }

  // 处理添加按钮
  const handleAdd = () => {
    console.log('Add clicked')
  }

  // 处理分享按钮
  const handleShare = () => {
    console.log('Share clicked')
  }

  // 处理Portfolio Order按钮
  const handlePortfolioOrderClick = () => {
    console.log('Portfolio Order clicked')
    router.push('/under-construction?source=my-tracker')
    router.refresh()
  }

  // 处理Ask AI按钮
  const handleAskAI = () => {
    console.log('Ask AI clicked')
    router.push('/ai-assistant?source=my-tracker')
    router.refresh()
  }

  // 处理公司卡片点击跳转到Stock Detail界面
  const handleCompanyCardClick = (company) => {
    const params = new URLSearchParams({
      stockId: company.id.toString(),
      source: 'my-tracker',
      name: company.name,
      symbol: company.symbol,
      price: company.price,
      change: company.change,
      trend: company.trend,
      image: company.image
    });
    router.push(`/stock-detail?${params.toString()}`);
    router.refresh();
  };

  // 处理标签切换
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  /* ------------------------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------------------------ */
  // 标签数据
  const tabs = ['Watchlist', 'Crypto Pioneer', 'Cancer', 'Pink Sheet Stocks']

  // 股票数据 - 模拟十张小卡片
  const stockData = [
    {
      id: 1,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      price: '175.43',
      change: '+2.34%',
      trend: 'up',
      image: '/images/home/Apple - AAPL.png'
    },
    {
      id: 2,
      name: 'Amazon.com Inc.',
      symbol: 'AMZN',
      price: '134.87',
      change: '-0.82%',
      trend: 'down',
      image: '/images/home/Amazon - AMZN.png'
    },
    {
      id: 3,
      name: 'Shell plc',
      symbol: 'SHEL',
      price: '58.24',
      change: '-0.38%',
      trend: 'down',
      image: '/images/home/Shell - SHEL.png'
    },
    {
      id: 4,
      name: 'British Petroleum Inc.',
      symbol: 'BP',
      price: '32.67',
      change: '+1.85%',
      trend: 'up',
      image: '/images/home/British Petroleum - BP.png'
    },
    {
      id: 5,
      name: 'Coca-Cola Co.',
      symbol: 'KO',
      price: '61.94',
      change: '+0.75%',
      trend: 'up',
      image: '/images/home/Coca-Cola - KO.png'
    },
    {
      id: 6,
      name: 'Meta Platforms Inc.',
      symbol: 'META',
      price: '298.52',
      change: '-2.15%',
      trend: 'down',
      image: '/images/home/Meta Platforms - META.png'
    },
    {
      id: 7,
      name: 'Netflix Inc.',
      symbol: 'NFLX',
      price: '425.89',
      change: '+3.67%',
      trend: 'up',
      image: '/images/home/Netflix - NFLX.png'
    },
    {
      id: 8,
      name: 'Nike Inc.',
      symbol: 'NKE',
      price: '89.73',
      change: '-1.24%',
      trend: 'down',
      image: '/images/home/Nike - NKE.png'
    },
    {
      id: 9,
      name: 'NVIDIA Corp.',
      symbol: 'NVDA',
      price: '465.21',
      change: '+5.89%',
      trend: 'up',
      image: '/images/home/NVIDIA - NVDA.png'
    },
    {
      id: 10,
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      price: '248.50',
      change: '+4.23%',
      trend: 'up',
      image: '/images/home/Tesla - TSLA.png'
    }
  ]

  const cryptoPioneerStockData = [
    {
      id: 1,
      short_name: 'Ciph...',
      name: 'Cipher Mining',
      symbol: 'CIFR',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/C.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 2,
      short_name: 'IREN...',
      name: 'IREN Limited',
      symbol: 'IREN',
      price: '135.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/I.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 3,
      short_name: 'Tao...',
      name: 'Tao Synergies',
      symbol: 'TAOX',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/T.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 4,
      short_name: 'Guof..',
      name: 'Guofu Quantum',
      symbol: '00290.HK',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/G.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 5,
      short_name: 'OKLink',
      name: 'OKLink',
      symbol: '01499.HK',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/O.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 6,
      short_name: 'Game...',
      name: 'GameStop',
      symbol: 'GME',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/G.png',
      chartImage: '/images/home/u59.png'
    }
  ]

  const cancerStockData = [
    {
      id: 1,
      short_name: 'Alph...',
      name: 'Alphabet Class A',
      symbol: 'GOOGL',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/A.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 2,
      short_name: 'NIO',
      name: 'NIO',
      symbol: 'NIO',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/N.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 3,
      short_name: 'Jink...',
      name: 'Jinko Solar',
      symbol: 'JKS',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/J.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 4,
      short_name: 'Apple',
      name: 'Apple',
      symbol: 'AAPL',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/company/Apple - AAPL.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 5,
      short_name: 'McDo...',
      name: 'McDonald’s',
      symbol: 'MCD',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/M.png',
      chartImage: '/images/home/u59.png'
    }
  ]

  const pinkSheetStockData = [
    {
      id: 1,
      short_name: 'DiDi...',
      name: 'DiDi Global Inc',
      symbol: 'DIDIY',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/D.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 2,
      short_name: 'Xiaomi',
      name: 'Xiaomi',
      symbol: 'XIACY',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/X.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 3,
      short_name: 'BYD...',
      name: 'BYD Company',
      symbol: 'BYDDY',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/B.png',
      chartImage: '/images/home/u53.png'
    },
    {
      id: 4,
      short_name: 'FUJI...',
      name: 'FUJIFILM Holding',
      symbol: 'FUJIY',
      price: '235.23',
      change: '-2.34%',
      trend: 'down',
      color: 'linear-gradient(180deg, #E95B9D 0%, #A1135A 100%)',
      image: '/images/alphabet/F.png',
      chartImage: '/images/home/u59.png'
    },
    {
      id: 5,
      short_name: 'Roll...',
      name: 'Rolls-Royce Holding',
      symbol: 'RYCEY',
      price: '235.23',
      change: '+2.34%',
      trend: 'up',
      color: 'linear-gradient(180deg, #84BE2C 0%, #508F0D 100%)',
      image: '/images/alphabet/R.png',
      chartImage: '/images/home/u53.png'
    }
  ]
  /* ------------------------------------------------------------------------------------------ */

  return (
    <div className="my-tracker-page">
      {/* 固定顶部导航 */}
      <TopNavigation
        title="My Tracker"
        onBackClick={handleBack}
        showSearch={true}
        showAdd={true}
        showShare={true}
        onSearchClick={handleSearch}
        onAddClick={handleAdd}
        onShareClick={handleShare}
      />

      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 标签导航 - 参考MyTrackerCard样式 */}
        <div className="tabs-section">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* 股票列表 - 参考trading-radar的companies-list样式 */}
        <div className="stocks-section">
          {activeTab === 'Watchlist' && (
            <div className="companies-list">
              {stockData.map((stock) => (
                <div 
                  key={stock.id} 
                  className={`company-card ${stock.trend}`}
                  onClick={() => handleCompanyCardClick(stock)}
                >
                  <div className="company-info">
                    <div className="company-logo">
                      <img src={stock.image} alt={stock.name} />
                    </div>
                    <div className="company-details">
                      <div className="company-name">{stock.name}</div>
                      <div className="company-symbol">{stock.symbol}</div>
                    </div>
                  </div>
                  <div className="company-stats">
                    <div className="price">{stock.price}</div>
                    <div className={`change ${stock.trend}`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Crypto Pioneer' && (
            <div className="companies-list">
              {cryptoPioneerStockData.map((stock) => (
                <div 
                  key={stock.id} 
                  className={`company-card ${stock.trend}`}
                  onClick={() => handleCompanyCardClick(stock)}
                >
                  <div className="company-info">
                    <div className="company-logo">
                      <img src={stock.image} alt={stock.name} />
                    </div>
                    <div className="company-details">
                      <div className="company-name">{stock.name}</div>
                      <div className="company-symbol">{stock.symbol}</div>
                    </div>
                  </div>
                  <div className="company-stats">
                    <div className="price">{stock.price}</div>
                    <div className={`change ${stock.trend}`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Cancer' && (
            <div className="companies-list">
              {cancerStockData.map((stock) => (
                <div 
                  key={stock.id} 
                  className={`company-card ${stock.trend}`}
                  onClick={() => handleCompanyCardClick(stock)}
                >
                  <div className="company-info">
                    <div className="company-logo">
                      <img src={stock.image} alt={stock.name} />
                    </div>
                    <div className="company-details">
                      <div className="company-name">{stock.name}</div>
                      <div className="company-symbol">{stock.symbol}</div>
                    </div>
                  </div>
                  <div className="company-stats">
                    <div className="price">{stock.price}</div>
                    <div className={`change ${stock.trend}`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Pink Sheet Stocks' && (
            <div className="companies-list">
              {pinkSheetStockData.map((stock) => (
                <div 
                  key={stock.id} 
                  className={`company-card ${stock.trend}`}
                  onClick={() => handleCompanyCardClick(stock)}
                >
                  <div className="company-info">
                    <div className="company-logo">
                      <img src={stock.image} alt={stock.name} />
                    </div>
                    <div className="company-details">
                      <div className="company-name">{stock.name}</div>
                      <div className="company-symbol">{stock.symbol}</div>
                    </div>
                  </div>
                  <div className="company-stats">
                    <div className="price">{stock.price}</div>
                    <div className={`change ${stock.trend}`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Others' && (
            <div className="placeholder-content">
              <p>Coming Soon - {activeTab}</p>
            </div>
          )}
        </div>
      </div>

      {/* 固定底部按钮 */}
      {/* <BottomActionButton 
        text="Portfolio Order"
        onClick={handlePortfolioOrderClick}
      /> */}

      {/* 固定Ask AI按钮 */}
      <AskAIButton 
        onClick={handleAskAI}
        positionBottom={35}
      />

      <style jsx>{`
        .my-tracker-page {
          min-height: 100vh;
          background: #EDF4F6;
          padding-bottom: 130px;
        }

        .main-content {
          padding: 70px 20px 20px;
          max-width: 428px;
          margin: 0 auto;
        }

        /* 标签导航样式 - 参考MyTrackerCard */
        .tabs-section {
          margin-bottom: 24px;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .tabs-container::-webkit-scrollbar {
          display: none;
        }
        
        .tab-item {
          flex-shrink: 0;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(0, 0, 0, 0.6);
        }
        
        .tab-item.active {
          background: #241A5D;
          color: white;
          font-weight: 600;
        }
        
        .tab-item:hover {
          background: rgba(93, 78, 117, 0.1);
        }
        
        .tab-item.active:hover {
          background: #241A5D;
        }

        /* 股票列表样式 - 参考trading-radar的companies-list */
        .stocks-section {
          margin-bottom: 20px;
        }

        .companies-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .company-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .company-card.up {
          background: linear-gradient(180deg, #84BE2C 0%, #508F0D 100%);
          border: none;
        }

        .company-card.down {
          background: linear-gradient(180deg, #E95B9D 0%, #A1135A 100%);
          border: none;
        }

        .company-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .company-card.up:hover {
          background: linear-gradient(180deg, #84BE2C 0%, #508F0D 100%);
        } 

        .company-card.down:hover {
          background: linear-gradient(180deg, #E95B9D 0%, #A1135A 100%);
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .company-logo {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .company-logo img {
          width: 103%;
          height: 103%;
          object-fit: cover;
        }

        .company-details {
          flex: 1;
        }

        .company-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .company-symbol {
          font-size: 12px;
          color: #fff;
          font-weight: 500;
        }

        .company-stats {
          text-align: right;
        }

        .company-stats .price {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .change {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }

        .change.up {
          color: #FFFFFF;
        }

        .change.down {
          color: #FFFFFF;
        }

        /* 占位符内容样式 - 参考MyTrackerCard */
        .placeholder-content {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background: #EDF4F6;
          border-radius: 20px;
          margin: 20px 0;
        }

        .placeholder-content p {
          color: rgba(0, 0, 0, 0.6);
          font-size: 16px;
          font-weight: 500;
          text-align: center;
          margin: 0;
        }
        
        /* 响应式设计 */
        @media (max-width: 428px) {
          .main-content {
            padding: 70px 16px 20px;
          }
        }
      `}</style>
    </div>
  )
}

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  QrCode,
  Scan,
  X,
} from "lucide-react";
import { TaskCard } from "./TaskCard";

export function TaskCenter() {
  const [isCompact, setIsCompact] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const [checkedDays, setCheckedDays] = useState(()=>{
    const saved = localStorage.getItem('checkedDays');
    return saved ? parseInt(saved) : 0;
  });
  
  const [reminderEnabled, setReminderEnabled] = useState(()=>{
    const saved = localStorage.getItem('reminderEnabled');
    return saved === 'true';
  });
  
  const [lastSignInDate, setLastSignInDate] = useState<string | null>(()=>{
    return localStorage.getItem('lastSignInDate');
  });

  const coinBalance = 58;
  const cashBalance = 0.23;

  useEffect(() => {
    localStorage.setItem('checkedDays', checkedDays.toString());
  }, [checkedDays]);

  useEffect(() => {
    localStorage.setItem('reminderEnabled', reminderEnabled.toString());
  }, [reminderEnabled]);

  useEffect(() => {
    localStorage.setItem('lastSignInDate', lastSignInDate || '');
  }, [lastSignInDate]);

  const signInRewards = [
    { day: 1, coins: 740, checked: checkedDays >= 1 },
    { day: 2, coins: 740, checked: checkedDays >= 2 },
    { day: 3, coins: 740, checked: checkedDays >= 3 },
    { day: 4, coins: 740, checked: checkedDays >= 4 },
    { day: 7, coins: 7650, checked: checkedDays >= 7, isSpecial: true }
  ];

  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const hasSignedInToday = lastSignInDate === getTodayString();

  const handleSignIn = () => {
    const today = getTodayString();

    if(hasSignedInToday) return;

    if (checkedDays < 7) {
      setCheckedDays(prev =>  prev + 1);
      setLastSignInDate(today);
    }
  };

  const getTodayReward = () => { 
    if(hasSignedInToday || checkedDays >= 7)
      return 0;

    if(checkedDays < 6){
      return 740;      
    } else if (checkedDays === 6) {
      return 7650;
    }
    
    return 0;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsCompact(scrollTop > 200);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () =>
      container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b">
        <button className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg">任务中心</h1>
        <button className="p-2 -mr-2 text-gray-600">
          更多
        </button>
      </header>

      {/* Compact Header (shown when scrolling) */}
      {isCompact && (
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between sticky top-[60px] z-10 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm">
              金币收益 <span>{coinBalance}</span>
            </span>
            <span className="text-sm">
              现金收益 <span>{cashBalance}</span>
            </span>
          </div>
          <button className="flex items-center gap-1 text-sm text-gray-600">
            详情 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto ${showSignInModal ? 'blur-sm' : ''}`}
      >
        {/* Pink Card */}
        <div className="mx-4 mt-4 mb-6 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-sm opacity-90 mb-1">
                金币收益
              </div>
              <div className="text-4xl mb-1">{coinBalance}</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">
                现金收益
              </div>
              <div className="text-4xl mb-1">{cashBalance}</div>
            </div>
            <button className="bg-white text-pink-500 px-5 py-2 rounded-full text-sm mt-2">
              去提现
            </button>
          </div>
          <div className="text-sm opacity-90">
            每天0点自动兑换成现金
          </div>
        </div>

        {/* Newcomer Special */}
        <div className="px-4 mb-4">
          <h2 className="text-lg mb-3">新人专享</h2>
          <TaskCard
            icon="💳"
            iconBg="bg-purple-100"
            title="新人1元提现"
            description="新人福利，点击提现1元现金"
            reward=""
            buttonText="去提现"
            buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
          />
        </div>

        {/* Daily Earn Coins */}
        <div className="px-4 mb-6">
          <h2 className="text-lg mb-3">天天赚金币</h2>
          <div className="space-y-3">
            <TaskCard
              icon="💰"
              iconBg="bg-orange-100"
              title="签到领金币"
              description="今日签到可得150金币"
              reward="150"
              buttonText="签到"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
              onClick={()=> setShowSignInModal(true)}
            />
            <TaskCard
              icon="🐷"
              iconBg="bg-pink-100"
              title="预约领金币"
              description="今日预约，明日一键领金币"
              reward="13"
              buttonText="去预约"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="🎁"
              iconBg="bg-red-100"
              title="金币红包雨"
              description="一大波红包来袭，先到先得"
              reward="最高20000"
              buttonText="去领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="📺"
              iconBg="bg-orange-100"
              title="领取桌面奖励"
              description="添加桌面助手，天天领额外金币"
              reward="9994"
              buttonText="去领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />

            {/* Invite Task with Sub-items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <TaskCard
                icon="👥"
                iconBg="bg-pink-100"
                title="邀新朋友看视频"
                description="邀首个邀好友得26元"
                reward="188元"
                redTag={true}
                buttonText="去赚钱"
                buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
              />

              {/* Sub-items */}
              <div className="px-4 pb-4 pt-2 flex gap-2">
                <button className="flex-1 bg-gray-50 rounded-lg py-3 flex items-center justify-center gap-2">
                  {/* <QrCode className="w-4 h-4 text-orange-500" /> */}
                  <Scan className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">当面扫码</span>
                </button>
                <button className="flex-1 bg-gray-50 rounded-lg py-3 flex items-center justify-center gap-2 relative">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm">微信邀请</span>
                  {/* <div className="absolute top-1 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    开宝箱得金币
                  </div> */}
                </button>
              </div>
            </div>

            <TaskCard
              icon="📺"
              iconBg="bg-purple-100"
              title="看广告视频"
              description="每5分钟看一次视频，单日最高11500金币"
              reward="11500"
              buttonText="去看看"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
              // badge="AD"
            />
            <TaskCard
              icon="🛍️"
              iconBg="bg-purple-100"
              title="逛街赚金币"
              description="浏览低价商品60秒即得209金币,每日可完成0/10次"
              reward="最高10000"
              buttonText="去逛街"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="🎁"
              iconBg="bg-red-100"
              title="抽万元大奖"
              description="看广告每日可抽0/10次，100%中奖"
              reward="最高1万"
              redTag={true}
              buttonText="去参与"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="📱"
              iconBg="bg-orange-100"
              title="看视频"
              description="每天看视频，最高4000金币"
              reward="4000"
              buttonText="待领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
              progress="累计126金币待领取 · 今日23:59:59过期"
            />
            <TaskCard
              icon="💳"
              iconBg="bg-yellow-100"
              title="免费送0.01元现金"
              description="极速到账银行卡，不消耗现金收益，点击立得!"
              reward="0.01元"
              redTag={true}
              buttonText="去领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="💎"
              iconBg="bg-orange-100"
              title="领支付积分赚金币"
              description="成功领取积分，即得388金币"
              reward="388"
              buttonText="去领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="💰"
              iconBg="bg-orange-100"
              title="天天领金币"
              description="今日签到立即领600金币，做任务最高可达25万金币"
              reward="600"
              buttonText="去领取"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <TaskCard
              icon="🛍️"
              iconBg="bg-pink-100"
              title="精选商品0.01元购"
              description="海量商品，好友欢价无套路立得"
              reward=""
              buttonText="去看看"
              buttonColor="bg-gradient-to-r from-pink-500 to-pink-600"
            />
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center py-6">
          <button className="text-sm text-gray-500">
            查看活动规则 {">"}
          </button>
        </div>
      </div>

      {/* Sign in Modal */}
      {
        showSignInModal && (  
          <>  
          <div 
            className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSignInModal(false)} />

          <div className="fixed inset-0 max-w-md mx-auto flex items-center justify-center z-50 px-4 pointer-events-none">
          
          <div className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Decorative Header Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 opacity-20"></div>
              
              {/* Floating Coin Decorations */}
              <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-yellow-300/30 blur-xl"></div>
              <div className="absolute top-12 right-12 w-16 h-16 rounded-full bg-orange-300/30 blur-xl"></div>
              
              {/* Title Section */}
              <div className="relative pt-8 pb-6 text-center">
                <div className="mb-2">
                  <span className="inline-block text-6xl animate-bounce">🎁</span>
                </div>
                <h2 className="text-3xl mb-2 bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">连续签到</h2>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <span className="text-sm">已连续签到</span>
                  <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg text-white text-lg shadow-md">
                    {checkedDays}
                  </span>
                  <span className="text-sm">天</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">坚持签到，领取更多金币奖励</p>
              </div>
            </div>

            {/* Rewards Track */}
            <div className="px-6 py-6 bg-white rounded-t-3xl -mt-2">
              <div className="relative mb-8">
                {/* Progress Bar Background */}
                <div className="absolute top-8 left-8 right-8 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ 
                      width: `${Math.min((checkedDays / 7) * 100, 100)}%`,
                    }}
                  />
                </div>

                {/* Reward Days */}
                <div className="flex justify-between relative">
                  {signInRewards.map((reward, index) => {
                    const isActive = checkedDays === reward.day;
                    const isCompleted = checkedDays >= reward.day;
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        {/* Day Circle */}
                        <div className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg scale-110' 
                            : 'bg-gray-100 border-2 border-gray-200'
                        } ${isActive ? 'ring-4 ring-yellow-200 animate-pulse' : ''}`}>
                          {isCompleted ? (
                            <div className="text-white text-2xl">✓</div>
                          ) : (
                            <>
                              <div className="text-2xl">{reward.isSpecial ? '🎁' : '🪙'}</div>
                            </>
                          )}
                          
                          {/* Coin Badge */}
                          {isCompleted && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-bounce">
                              +{reward.coins}
                            </div>
                          )}
                        </div>
                        
                        {/* Coin Amount */}
                        <div className={`mt-3 text-sm transition-colors ${
                          isCompleted ? 'text-orange-500' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">💰</span>{reward.coins}
                        </div>
                        
                        {/* Day Label */}
                        <div className={`mt-1 text-xs ${
                          isCompleted ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {reward.day === 1 ? '今天' : reward.day === 7 ? '第7天' : `第${reward.day}天`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Rewards Info */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 mb-4 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="text-xs text-gray-600">7天累计可得</p>
                      <p className="text-lg text-orange-600">12,070 金币</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">今日可得</p>
                    <p className="text-lg text-pink-600">
                      {getTodayReward()} 
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign-in Button */}
              <button 
                onClick={handleSignIn}
                disabled={checkedDays >= 7 || hasSignedInToday}
                className={`w-full py-4 rounded-2xl text-white text-lg transition-all shadow-lg ${
                  checkedDays >= 7 || hasSignedInToday
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:shadow-xl active:scale-95 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600'
                }`}
              >
                {checkedDays >= 7 ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✅</span>
                    <span>已完成本周签到</span>
                  </span>
                ) : hasSignedInToday ? (
                    <span className="flex items-center justify-center gap-2">
                      <span>✅</span>
                      <span>今日已签到,明天再来</span>
                    </span>                  
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🎉</span>
                    <span>立即签到领 {getTodayReward()} 金币</span>
                  </span>
                )}
              </button>

              {/* Reminder Toggle */}
              <div className="mt-4 flex items-center justify-center gap-3 py-3">
                <span className="text-sm text-gray-600">⏰ 每日签到提醒</span>
                <button 
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    reminderEnabled 
                      ? 'bg-gradient-to-r from-orange-400 to-pink-400 shadow-md' 
                      : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                    reminderEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Additional Info */}
              <p className="text-center text-xs text-gray-400 mt-3">
                每天00:00重置签到，连续签到7天可额外获得大礼包
              </p>
            </div>
          </div>          
        </div>
        </>
        )
      }
    </div>
  );
}
<template>
<!-- 主内容区域 -->
<div class="main-content no-nav">
    <!-- 欢迎部分 -->
    <div class="welcome-section">
        <div class="welcome-title">欢迎使用 BoneAI 系统</div>
        <div class="welcome-date">今日工作概览 - 2023年8月15日</div>
    </div>
    <!-- 统计卡片 -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon blue">📋</div>
                <div class="stat-label">待处理病例</div>
            </div>
            <div class="stat-value">12</div>
            <div class="stat-change up">↑ 2个新增</div>
            <div class="stat-detail">轻上周下降 1.2%，需关注</div>
            <a class="stat-link">查看详情 ></a>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon green">✓</div>
                <div class="stat-label">今日诊断</div>
            </div>
            <div class="stat-value">8</div>
            <div class="stat-change up">↑ 3个完成</div>
            <div class="stat-detail"></div>
            <a class="stat-link">查看详情 ></a>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon purple">%</div>
                <div class="stat-label">准确率</div>
            </div>
            <div class="stat-value">94.2%</div>
            <div class="stat-change down">↓ 1.2% 下降</div>
            <div class="stat-detail">轻上周下降 1.2%，需关注</div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon gray">📊</div>
                <div class="stat-label">系统状态</div>
            </div>
            <div class="stat-value">正常</div>
            <div class="stat-change up">● 运行中</div>
            <div class="stat-detail">连续运行时间：128天</div>
        </div>
    </div>
    <!-- 图表区域 -->
    <div class="charts-grid">
        <!-- 柱状图 -->
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">月度诊断统计</div>
                <a class="chart-action">⬇ 导出数据</a>
            </div>
            <div class="bar-chart">
                <div class="bar-item">
                    <div class="bar" style="height: 60%;"></div>
                    <div class="bar-label">1月</div>
                    <div class="bar-value">120</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 100%;"></div>
                    <div class="bar-label">2月</div>
                    <div class="bar-value">200</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 70%;"></div>
                    <div class="bar-label">3月</div>
                    <div class="bar-value">140</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 40%;"></div>
                    <div class="bar-label">4月</div>
                    <div class="bar-value">80</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 35%;"></div>
                    <div class="bar-label">5月</div>
                    <div class="bar-value">70</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 55%;"></div>
                    <div class="bar-label">6月</div>
                    <div class="bar-value">110</div>
                </div>
                <div class="bar-item">
                    <div class="bar" style="height: 70%;"></div>
                    <div class="bar-label">7月</div>
                    <div class="bar-value">140</div>
                </div>
            </div>
        </div>
        <!-- 饼图 -->
        <div class="chart-card">
            <div class="chart-header">
                <div class="chart-title">疾病分类分布</div>
                <a class="chart-action">🔄 刷新</a>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; height: 300px;">
                <div class="pie-chart">
                    <div class="pie-circle">
                        <div class="pie-center">
                            <div class="pie-percentage">100%</div>
                            <div class="pie-label">总病例</div>
                        </div>
                    </div>
                </div>
                <div class="pie-legend">
                    <div class="legend-item">
                        <div class="legend-color blue"></div>
                        <span>半月板损伤 (50%)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color orange"></div>
                        <span>骨折 (25%)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color red"></div>
                        <span>韧带损伤 (15%)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color green"></div>
                        <span>关节炎 (8%)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color blue" style="opacity: 0.5;"></div>
                        <span>其他 (2%)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f7fa;
    color: #333;
}
.main-content.no-nav {
    background: #f5f7fa;
    min-height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 0 24px 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
}
.welcome-section {
    margin-bottom: 32px;
    padding-top: 44px;
    padding-left: 6vw;
    padding-right: 6vw;
}
.welcome-title {font-size: 28px;font-weight: 700;margin-bottom: 8px;color: #1f2937;}
.welcome-date {font-size: 14px;color: #666;}
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
    padding-left: 6vw;
    padding-right: 6vw;
}
.stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
    transition: all .3s;
}
.stat-card:hover {box-shadow: 0 4px 12px rgba(0,0,0,.10);transform: translateY(-2px);}
.stat-header {display: flex;align-items: center;gap: 12px;margin-bottom: 16px;}
.stat-icon {width: 48px;height: 48px;border-radius: 12px;display: flex;align-items: center;justify-content: center;font-size: 24px;}
.stat-icon.blue {background: #dbeafe;color: #1e40af;}
.stat-icon.green {background: #dcfce7;color: #16a34a;}
.stat-icon.purple {background: #f3e8ff;color: #9333ea;}
.stat-icon.gray {background: #f3f4f6;color: #6b7280;}
.stat-label {font-size: 14px;color: #666;}
.stat-value {font-size: 32px;font-weight: 700;color: #1f2937;margin-bottom: 8px;}
.stat-change {font-size: 12px;display: flex;align-items: center;gap: 4px;}
.stat-change.up {color: #16a34a;}
.stat-change.down {color: #dc2626;}
.stat-detail {font-size: 12px;color: #999;margin-top: 8px;}
.stat-link {color: #1e40af;text-decoration: none;font-size: 12px;margin-top: 12px;display: inline-block;cursor: pointer;transition: color .3s;}
.stat-link:hover {color: #1e3a8a;text-decoration: underline;}
.charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-left: 6vw;
    padding-right: 6vw;
}
.chart-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
}
.chart-header {display: flex;align-items: center;justify-content: space-between;margin-bottom: 24px;}
.chart-title {font-size: 16px;font-weight: 600;color: #1f2937;}
.chart-action {color: #1e40af;font-size: 12px;cursor: pointer;text-decoration: none;transition: color .3s;}
.chart-action:hover {color: #1e3a8a;}
.bar-chart {display: flex;align-items: flex-end;justify-content: space-around;height: 300px;gap: 12px;}
.bar-item {display: flex;flex-direction: column;align-items: center;gap: 8px;flex: 1;}
.bar {width: 100%;background: linear-gradient(180deg, #1e40af 0%, #3b82f6 100%);border-radius: 6px 6px 0 0;transition: all 0.3s ease;cursor: pointer;}
.bar:hover {opacity: 0.8;transform: scaleY(1.05);}
.bar-label {font-size: 12px;color: #666;font-weight: 500;}
.bar-value {font-size: 12px;color: #999;margin-top: 4px;}
.pie-chart {display: flex;align-items: center;justify-content: center;height: 300px;position: relative;}
.pie-circle {width: 200px;height: 200px;border-radius: 50%;background: conic-gradient(#1e40af 0deg 180deg,#f59e0b 180deg 270deg,#ef4444 270deg 324deg,#16a34a 324deg 360deg);display: flex;align-items: center;justify-content: center;position: relative;box-shadow: 0 4px 12px rgba(0,0,0,.1);}
.pie-center {width: 140px;height: 140px;background: white;border-radius: 50%;display: flex;flex-direction: column;align-items: center;justify-content: center;}
.pie-percentage {font-size: 32px;font-weight: 700;color: #1f2937;}
.pie-label {font-size: 12px;color: #999;}
.pie-legend {display: flex;flex-direction: column;gap: 12px;margin-left: 32px;}
.legend-item {display: flex;align-items: center;gap: 8px;font-size: 12px;}
.legend-color {width: 12px;height: 12px;border-radius: 2px;}
.legend-color.blue {background: #1e40af;}
.legend-color.orange {background: #f59e0b;}
.legend-color.red {background: #ef4444;}
.legend-color.green {background: #16a34a;}
@media (max-width: 1200px) {.charts-grid{grid-template-columns:1fr;}}
@media (max-width: 768px) {
    .main-content.no-nav{padding: 0;}
    .welcome-section, .charts-grid, .stats-grid{padding-left: 0;padding-right: 0;}
    .stats-grid{grid-template-columns: 1fr;}
}
</style>
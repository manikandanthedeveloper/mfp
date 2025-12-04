<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">📊 Analytics Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div class="header-right">
          <button class="header-btn" @click="refreshData">
            <span class="btn-icon">🔄</span>
            <span>Refresh</span>
          </button>
          <button class="header-btn primary" @click="showExportModal = true">
            <span class="btn-icon">📥</span>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Selector -->
    <div class="date-range-selector">
      <button 
        v-for="range in dateRanges" 
        :key="range.value"
        :class="['date-btn', { active: selectedRange === range.value }]"
        @click="selectDateRange(range.value)"
      >
        {{ range.label }}
      </button>
      <div class="custom-date">
        <input type="date" v-model="startDate" class="date-input" />
        <span>to</span>
        <input type="date" v-model="endDate" class="date-input" />
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="metrics-grid">
      <div 
        v-for="metric in keyMetrics" 
        :key="metric.id"
        class="metric-card"
        :style="{ borderLeftColor: metric.color }"
      >
        <div class="metric-header">
          <span class="metric-icon" :style="{ backgroundColor: metric.color + '20' }">
            {{ metric.icon }}
          </span>
          <span class="metric-trend" :class="metric.trend">
            {{ metric.change }}
            <span class="trend-arrow">{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
          </span>
        </div>
        <div class="metric-body">
          <h3 class="metric-value">{{ metric.value }}</h3>
          <p class="metric-label">{{ metric.label }}</p>
          <div class="metric-progress">
            <div 
              class="progress-fill" 
              :style="{ width: metric.progress + '%', backgroundColor: metric.color }"
            ></div>
          </div>
          <p class="metric-subtitle">{{ metric.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <div class="chart-card large">
        <div class="card-header">
          <h2 class="card-title">💰 Revenue Overview</h2>
          <div class="card-actions">
            <select v-model="revenueChartType" class="chart-type-select">
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <Line v-if="revenueChartType === 'line'" :data="revenueChartData" :options="chartOptions" />
          <Bar v-if="revenueChartType === 'bar'" :data="revenueChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- User Analytics Chart -->
      <div class="chart-card medium">
        <div class="card-header">
          <h2 class="card-title">👥 User Analytics</h2>
        </div>
        <div class="card-body">
          <Doughnut :data="userAnalyticsData" :options="doughnutOptions" />
          <div class="chart-legend">
            <div v-for="(item, index) in userAnalyticsData.labels" :key="index" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: userAnalyticsData.datasets[0].backgroundColor[index] }"></span>
              <span class="legend-label">{{ item }}</span>
              <span class="legend-value">{{ userAnalyticsData.datasets[0].data[index] }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="chart-card medium">
        <div class="card-header">
          <h2 class="card-title">🌐 Traffic Sources</h2>
        </div>
        <div class="card-body">
          <Bar :data="trafficSourcesData" :options="horizontalBarOptions" />
        </div>
      </div>
    </div>

    <!-- Data Tables Section -->
    <div class="tables-grid">
      <!-- Recent Transactions -->
      <div class="table-card">
        <div class="card-header">
          <h2 class="card-title">💳 Recent Transactions</h2>
          <div class="card-actions">
            <input 
              type="text" 
              v-model="transactionSearch" 
              placeholder="Search transactions..." 
              class="search-input"
            />
            <button class="icon-btn" @click="sortTransactions">
              <span>⇅</span>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                  <td><span class="id-badge">#{{ transaction.id }}</span></td>
                  <td>
                    <div class="customer-cell">
                      <div class="avatar">{{ transaction.customer.charAt(0) }}</div>
                      <span>{{ transaction.customer }}</span>
                    </div>
                  </td>
                  <td>{{ transaction.product }}</td>
                  <td class="amount">{{ formatCurrency(transaction.amount) }}</td>
                  <td>
                    <span :class="['status-badge', transaction.status]">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td>{{ transaction.date }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn view" @click="viewTransaction(transaction)" title="View">👁️</button>
                      <button class="action-btn edit" @click="editTransaction(transaction)" title="Edit">✏️</button>
                      <button class="action-btn delete" @click="deleteTransaction(transaction)" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-pagination">
            <button 
              class="pagination-btn" 
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
            <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
              class="pagination-btn" 
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="table-card">
        <div class="card-header">
          <h2 class="card-title">🏆 Top Performing Products</h2>
        </div>
        <div class="card-body">
          <div class="product-list">
            <div v-for="(product, index) in topProducts" :key="product.id" class="product-item">
              <div class="product-rank">{{ index + 1 }}</div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-category">{{ product.category }}</p>
              </div>
              <div class="product-stats">
                <div class="stat">
                  <span class="stat-label">Sales</span>
                  <span class="stat-value">{{ product.sales }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Revenue</span>
                  <span class="stat-value">{{ formatCurrency(product.revenue) }}</span>
                </div>
              </div>
              <div class="product-rating">
                <div class="stars">{{ '⭐'.repeat(product.rating) }}</div>
                <span class="rating-value">{{ product.rating }}.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed & Tasks -->
    <div class="bottom-grid">
      <!-- Activity Feed -->
      <div class="activity-card">
        <div class="card-header">
          <h2 class="card-title">⚡ Recent Activity</h2>
          <button class="icon-btn" @click="loadMoreActivities">
            <span>⟳</span>
          </button>
        </div>
        <div class="card-body">
          <div class="activity-feed">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :style="{ backgroundColor: activity.color + '20' }">
                {{ activity.icon }}
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Manager -->
      <div class="task-card">
        <div class="card-header">
          <h2 class="card-title">✅ Tasks</h2>
          <button class="icon-btn" @click="showAddTask = !showAddTask">
            <span>+</span>
          </button>
        </div>
        <div class="card-body">
          <div v-if="showAddTask" class="add-task-form">
            <input 
              v-model="newTaskName" 
              type="text" 
              placeholder="Task name..." 
              class="task-input"
              @keyup.enter="addTask"
            />
            <button @click="addTask" class="add-btn">Add</button>
          </div>
          <div class="task-list">
            <div 
              v-for="task in tasks" 
              :key="task.id" 
              :class="['task-item', { completed: task.completed }]"
            >
              <input 
                type="checkbox" 
                v-model="task.completed" 
                :id="`task-${task.id}`"
                class="task-checkbox"
              />
              <label :for="`task-${task.id}`" class="task-label">
                {{ task.name }}
              </label>
              <span class="task-priority" :class="task.priority">
                {{ task.priority }}
              </span>
              <button class="task-delete" @click="deleteTask(task.id)">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-card">
        <div class="card-header">
          <h2 class="card-title">📈 Quick Stats</h2>
        </div>
        <div class="card-body">
          <div class="quick-stats">
            <div v-for="stat in quickStats" :key="stat.id" class="quick-stat-item">
              <div class="stat-icon" :style="{ backgroundColor: stat.color }">
                {{ stat.icon }}
              </div>
              <div class="stat-content">
                <p class="stat-value">{{ stat.value }}</p>
                <p class="stat-label">{{ stat.label }}</p>
                <div class="stat-bar">
                  <div 
                    class="stat-bar-fill" 
                    :style="{ width: stat.percentage + '%', backgroundColor: stat.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click="showExportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Export Data</h3>
          <button class="modal-close" @click="showExportModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <button @click="exportData('csv')" class="export-btn">
              <span class="export-icon">📄</span>
              <span>Export as CSV</span>
            </button>
            <button @click="exportData('pdf')" class="export-btn">
              <span class="export-icon">📑</span>
              <span>Export as PDF</span>
            </button>
            <button @click="exportData('excel')" class="export-btn">
              <span class="export-icon">📊</span>
              <span>Export as Excel</span>
            </button>
            <button @click="exportData('json')" class="export-btn">
              <span class="export-icon">💾</span>
              <span>Export as JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  name: 'Dashboard',
  components: {
    Line,
    Bar,
    Doughnut
  },
  data() {
    return {
      selectedRange: '7d',
      startDate: '',
      endDate: '',
      transactionSearch: '',
      currentPage: 1,
      itemsPerPage: 5,
      showExportModal: false,
      showAddTask: false,
      newTaskName: '',
      revenueChartType: 'line',
      dateRanges: [
        { label: 'Today', value: '1d' },
        { label: '7 Days', value: '7d' },
        { label: '30 Days', value: '30d' },
        { label: '90 Days', value: '90d' },
        { label: 'Year', value: '1y' }
      ],
      keyMetrics: [
        {
          id: 1,
          icon: '💰',
          label: 'Total Revenue',
          value: '$127,430',
          change: '+12.5%',
          trend: 'up',
          color: '#10b981',
          progress: 75,
          subtitle: 'vs last month'
        },
        {
          id: 2,
          icon: '👥',
          label: 'Active Users',
          value: '8,549',
          change: '+23.1%',
          trend: 'up',
          color: '#3b82f6',
          progress: 85,
          subtitle: '2,341 new users'
        },
        {
          id: 3,
          icon: '📦',
          label: 'Total Orders',
          value: '2,347',
          change: '-3.2%',
          trend: 'down',
          color: '#f59e0b',
          progress: 60,
          subtitle: 'Last 30 days'
        },
        {
          id: 4,
          icon: '⭐',
          label: 'Avg. Rating',
          value: '4.8',
          change: '+0.3',
          trend: 'up',
          color: '#8b5cf6',
          progress: 96,
          subtitle: 'From 1,234 reviews'
        }
      ],
      transactions: [
        { id: 1001, customer: 'John Doe', product: 'Wireless Headphones', amount: 129.99, status: 'completed', date: '2025-12-04' },
        { id: 1002, customer: 'Jane Smith', product: 'Smart Watch', amount: 299.99, status: 'pending', date: '2025-12-04' },
        { id: 1003, customer: 'Bob Johnson', product: 'Laptop Stand', amount: 49.99, status: 'completed', date: '2025-12-03' },
        { id: 1004, customer: 'Alice Brown', product: 'USB-C Hub', amount: 79.99, status: 'processing', date: '2025-12-03' },
        { id: 1005, customer: 'Charlie Wilson', product: 'Mechanical Keyboard', amount: 159.99, status: 'completed', date: '2025-12-02' },
        { id: 1006, customer: 'Diana Miller', product: 'Webcam HD', amount: 89.99, status: 'cancelled', date: '2025-12-02' },
        { id: 1007, customer: 'Eve Davis', product: 'Phone Case', amount: 19.99, status: 'completed', date: '2025-12-01' },
        { id: 1008, customer: 'Frank Moore', product: 'Power Bank', amount: 45.99, status: 'pending', date: '2025-12-01' }
      ],
      topProducts: [
        { id: 1, name: 'Wireless Headphones Pro', category: 'Electronics', sales: 1234, revenue: 159867.66, rating: 5 },
        { id: 2, name: 'Smart Fitness Watch', category: 'Wearables', sales: 987, revenue: 295913.13, rating: 5 },
        { id: 3, name: 'Laptop Stand Aluminum', category: 'Accessories', sales: 856, revenue: 42743.44, rating: 4 },
        { id: 4, name: 'USB-C Multi Hub', category: 'Electronics', sales: 743, revenue: 59417.57, rating: 4 },
        { id: 5, name: 'Mechanical Keyboard RGB', category: 'Peripherals', sales: 654, revenue: 104559.46, rating: 5 }
      ],
      tasks: [
        { id: 1, name: 'Review Q4 financial reports', completed: false, priority: 'high' },
        { id: 2, name: 'Update product inventory', completed: true, priority: 'medium' },
        { id: 3, name: 'Customer support training', completed: false, priority: 'low' },
        { id: 4, name: 'Prepare marketing campaign', completed: false, priority: 'high' },
        { id: 5, name: 'Database backup', completed: true, priority: 'medium' }
      ],
      recentActivities: [
        { id: 1, icon: '🛒', text: 'New order #1008 received from Frank Moore', time: '2 minutes ago', color: '#10b981' },
        { id: 2, icon: '👤', text: 'New user registration: sarah.williams@email.com', time: '15 minutes ago', color: '#3b82f6' },
        { id: 3, icon: '💳', text: 'Payment processed for order #1007', time: '1 hour ago', color: '#8b5cf6' },
        { id: 4, icon: '📦', text: 'Order #1006 cancelled by customer', time: '2 hours ago', color: '#ef4444' },
        { id: 5, icon: '⭐', text: 'New 5-star review on Wireless Headphones Pro', time: '3 hours ago', color: '#f59e0b' },
        { id: 6, icon: '🔔', text: 'Stock alert: USB-C Hub running low', time: '4 hours ago', color: '#f59e0b' }
      ],
      quickStats: [
        { id: 1, icon: '📨', label: 'New Messages', value: '24', percentage: 60, color: '#3b82f6' },
        { id: 2, icon: '🎯', label: 'Goals Achieved', value: '18/25', percentage: 72, color: '#10b981' },
        { id: 3, icon: '🚀', label: 'Active Campaigns', value: '7', percentage: 45, color: '#8b5cf6' },
        { id: 4, icon: '⚠️', label: 'Pending Issues', value: '3', percentage: 15, color: '#ef4444' }
      ],
      revenueChartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue 2025',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 38000, 42000, 45000],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Revenue 2024',
            data: [10000, 15000, 13000, 20000, 18000, 25000, 23000, 28000, 26000, 30000, 33000, 35000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      userAnalyticsData: {
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        datasets: [{
          data: [45, 35, 15, 5],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
        }]
      },
      trafficSourcesData: {
        labels: ['Organic Search', 'Direct', 'Social Media', 'Referral', 'Email', 'Paid Ads'],
        datasets: [{
          label: 'Visitors',
          data: [4500, 3200, 2800, 1900, 1500, 2100],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      },
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      },
      horizontalBarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  },
  computed: {
    filteredTransactions() {
      let filtered = this.transactions;
      if (this.transactionSearch) {
        const search = this.transactionSearch.toLowerCase();
        filtered = filtered.filter(t => 
          t.customer.toLowerCase().includes(search) ||
          t.product.toLowerCase().includes(search) ||
          t.id.toString().includes(search)
        );
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.transactions.length / this.itemsPerPage);
    }
  },
  methods: {
    formatCurrency(value) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    },
    selectDateRange(range) {
      this.selectedRange = range;
      console.log('Date range selected:', range);
    },
    refreshData() {
      console.log('Refreshing dashboard data...');
      // Simulate data refresh
      this.keyMetrics = this.keyMetrics.map(m => ({
        ...m,
        value: this.generateRandomValue(m.label)
      }));
    },
    generateRandomValue(label) {
      if (label === 'Total Revenue') return '$' + (Math.floor(Math.random() * 50000) + 100000).toLocaleString();
      if (label === 'Active Users') return (Math.floor(Math.random() * 2000) + 7000).toLocaleString();
      if (label === 'Total Orders') return (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
      if (label === 'Avg. Rating') return (Math.random() * 0.5 + 4.5).toFixed(1);
    },
    sortTransactions() {
      this.transactions.reverse();
    },
    viewTransaction(transaction) {
      alert(`Viewing transaction #${transaction.id}\nCustomer: ${transaction.customer}\nProduct: ${transaction.product}\nAmount: ${this.formatCurrency(transaction.amount)}`);
    },
    editTransaction(transaction) {
      console.log('Edit transaction:', transaction);
    },
    deleteTransaction(transaction) {
      if (confirm(`Delete transaction #${transaction.id}?`)) {
        const index = this.transactions.findIndex(t => t.id === transaction.id);
        if (index > -1) {
          this.transactions.splice(index, 1);
        }
      }
    },
    addTask() {
      if (this.newTaskName.trim()) {
        this.tasks.push({
          id: Date.now(),
          name: this.newTaskName,
          completed: false,
          priority: 'medium'
        });
        this.newTaskName = '';
        this.showAddTask = false;
      }
    },
    deleteTask(id) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    },
    loadMoreActivities() {
      console.log('Loading more activities...');
    },
    exportData(format) {
      console.log(`Exporting data as ${format}...`);
      alert(`Data exported as ${format.toUpperCase()}`);
      this.showExportModal = false;
    }
  },
  mounted() {
    // Set default date range
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = weekAgo.toISOString().split('T')[0];
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

/* Header */
.dashboard-header {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 8px 0 0 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.header-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.header-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Date Range Selector */
.date-range-selector {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.date-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.date-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.date-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.custom-date {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.date-input {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  font-size: 32px;
  padding: 12px;
  border-radius: 12px;
}

.metric-trend {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-trend.up {
  color: #10b981;
  background: #d1fae5;
}

.metric-trend.down {
  color: #ef4444;
  background: #fee2e2;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.metric-progress {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.metric-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.chart-card.large {
  grid-column: span 2;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-type-select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.card-body {
  padding: 24px;
}

.card-body canvas {
  max-height: 300px;
}

.chart-legend {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-label {
  font-size: 13px;
  color: #6b7280;
  flex: 1;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* Tables Grid */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.search-input {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
}

.icon-btn {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f9fafb;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table td {
  padding: 16px 12px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.id-badge {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #667eea;
  background: #ede9fe;
  padding: 4px 8px;
  border-radius: 4px;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.amount {
  font-weight: 600;
  color: #10b981;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

/* Product List */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  transition: all 0.2s;
}

.product-item:hover {
  border-color: #667eea;
  background: #fafbff;
}

.product-rank {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.product-category {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.product-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.product-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stars {
  font-size: 14px;
}

.rating-value {
  font-size: 13px;
  font-weight: 600;
  color: #f59e0b;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.activity-card,
.task-card,
.stats-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Activity Feed */
.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #374151;
  margin: 0 0 4px 0;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}

/* Task Manager */
.add-task-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.task-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.add-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #f3f4f6;
  border-radius: 8px;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #e5e7eb;
}

.task-item.completed .task-label {
  text-decoration: line-through;
  opacity: 0.5;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.task-label {
  flex: 1;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.task-priority {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.task-priority.high {
  background: #fee2e2;
  color: #991b1b;
}

.task-priority.medium {
  background: #fef3c7;
  color: #92400e;
}

.task-priority.low {
  background: #dbeafe;
  color: #1e40af;
}

.task-delete {
  width: 24px;
  height: 24px;
  border: none;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.task-delete:hover {
  background: #ef4444;
  color: white;
}

/* Quick Stats */
.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quick-stat-item {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-content .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stat-content .stat-label {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 8px 0;
}

.stat-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 24px;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.export-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  border-color: #667eea;
  background: #fafbff;
  transform: translateY(-2px);
}

.export-icon {
  font-size: 32px;
}

/* Responsive */
@media (max-width: 1200px) {
  .chart-card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .dashboard-header {
    padding: 20px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .metrics-grid,
  .charts-grid,
  .tables-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .custom-date {
    margin-left: 0;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .export-options {
    grid-template-columns: 1fr;
  }
}
</style>

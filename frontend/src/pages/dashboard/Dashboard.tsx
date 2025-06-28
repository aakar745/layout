import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Spin, 
  Button, 
  Space, 
  Empty,
  Timeline,
  notification,
  Calendar,
  Badge
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import './Dashboard.css';
import dashboardService from '../../services/dashboard';

const { Title, Text, Paragraph } = Typography;

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  color: string;
  text: React.ReactNode;
  timestamp: string;
  type: 'booking' | 'user' | 'exhibition';
}

// Array of motivational sales quotes
const salesQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "If you're going through hell, keep going. - Winston Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "Champions keep playing until they get it right. - Billie Jean King",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Go confidently in the direction of your dreams. Live the life you have imagined. - Henry David Thoreau",
  "When you have a dream, you've got to grab it and never let go. - Carol Burnett",
  "Nothing is impossible. The word itself says 'I'm possible!' - Audrey Hepburn",
  "There is only one way to avoid criticism: do nothing, say nothing, and be nothing. - Aristotle",
  "Ask and it will be given to you; search, and you will find; knock and the door will be opened for you. - Jesus",
  "The only true wisdom is in knowing you know nothing. - Socrates",
  "The best revenge is massive success. - Frank Sinatra",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The future belongs to those who prepare for it today. - Malcolm X",
  "A person who never made a mistake never tried anything new. - Albert Einstein",
  "Life is 10% what happens to you and 90% how you react to it. - Charles R. Swindoll",
  "The most difficult thing is the decision to act, the rest is merely tenacity. - Amelia Earhart",
  "Every strike brings me closer to the next home run. - Babe Ruth",
  "Definiteness of purpose is the starting point of all achievement. - W. Clement Stone",
  "Life isn't about getting and having, it's about giving and being. - Kevin Kruse",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "I am not a product of my circumstances. I am a product of my decisions. - Stephen Covey",
  "Every child is an artist. The problem is how to remain an artist once he grows up. - Pablo Picasso",
  "You can never cross the ocean until you have the courage to lose sight of the shore. - Christopher Columbus",
  "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. - Maya Angelou",
  "Either you run the day, or the day runs you. - Jim Rohn",
  "Whether you think you can or you think you can't, you're right. - Henry Ford"
];

// Function to get time-based greeting
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

// Function to get random motivational quote
const getRandomQuote = (): string => {
  return salesQuotes[Math.floor(Math.random() * salesQuotes.length)];
};

// Simple Indian holidays for calendar (only major national ones)
const indianHolidays: Record<string, string> = {
  '2024-01-26': 'Republic Day',
  '2024-08-15': 'Independence Day',
  '2024-10-02': 'Gandhi Jayanti',
  '2024-11-01': 'Diwali',
  '2024-12-25': 'Christmas',
  '2025-01-26': 'Republic Day',
  '2025-03-14': 'Holi',
  '2025-08-15': 'Independence Day',
  '2025-10-02': 'Gandhi Jayanti',
  '2025-10-20': 'Diwali',
  '2025-12-25': 'Christmas',
};

// Function to check if date is a holiday
const getHoliday = (date: Dayjs): string | null => {
  const dateKey = date.format('YYYY-MM-DD');
  return indianHolidays[dateKey] || null;
};



// Greeting Card Component
const GreetingCard: React.FC<{ currentTime: Date; quote: string }> = ({ currentTime, quote }) => (
  <Card 
    className="greeting-card"
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      height: '100%',
      minHeight: '200px'
    }}
  >
    <div style={{ color: 'white', textAlign: 'center' }}>
      <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
        {getTimeBasedGreeting()}! 👋
      </Title>
      <div style={{ fontSize: '18px', marginBottom: '16px', opacity: 0.9 }}>
        {currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        {currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}
        <span style={{ 
          display: 'inline-block',
          width: '8px',
          height: '8px',
          backgroundColor: '#52c41a',
          borderRadius: '50%',
          marginLeft: '8px',
          animation: 'pulse 2s infinite'
        }} title="Live time" />
      </div>
    </div>
  </Card>
);

// Motivational Quote Card Component
const QuoteCard: React.FC<{ quote: string }> = ({ quote }) => (
  <Card 
    className="quote-card"
    style={{ height: '100%', minHeight: '200px' }}
    title={
      <Space>
        <TrophyOutlined style={{ color: '#f59e0b' }} />
        Daily Motivation
      </Space>
    }
  >
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      height: '100%',
      textAlign: 'center'
    }}>
      <StarOutlined style={{ 
        fontSize: '32px', 
        color: '#f59e0b', 
        marginBottom: '16px' 
      }} />
      <Text style={{ 
        fontSize: '16px', 
        fontStyle: 'italic', 
        lineHeight: '1.6',
        color: '#374151'
      }}>
        "{quote}"
      </Text>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const navigate = useNavigate();

  // Update time every second for live display
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Pause timer when tab is not visible and resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, we could pause here if needed
        // For now, we'll keep it running for simplicity
      } else {
        // Tab is visible, update time immediately
        setCurrentTime(new Date());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Set random quote on component mount
  useEffect(() => {
    setMotivationalQuote(getRandomQuote());
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getDashboardStats();
        
        // Process recent activities with more variety
        const activities: ActivityItem[] = [];
        
        // Add recent bookings with more details
        stats.recentBookings.forEach(booking => {
          const statusColor = booking.status === 'confirmed' ? '#52c41a' : 
                            booking.status === 'approved' ? '#1890ff' : 
                            booking.status === 'pending' ? '#faad14' : '#ff4d4f';
          
          activities.push({
            id: `booking-${booking._id}`,
            icon: <ShoppingCartOutlined />,
            color: statusColor,
            text: (
              <div>
                <Text strong>{booking.customerName || 'New Customer'}</Text> {booking.status === 'confirmed' ? 'confirmed' : 'made'} a booking
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {booking.companyName || 'Company'} • Status: {booking.status?.toUpperCase()} 
                  {booking.amount && ` • ₹${booking.amount.toLocaleString()}`}
                </Text>
              </div>
            ),
            timestamp: new Date(booking.createdAt).toLocaleString(),
            type: 'booking'
          });
        });
        
        // Add recent users with role information
        stats.recentUsers.forEach(user => {
          activities.push({
            id: `user-${user._id}`,
            icon: <UserOutlined />,
            color: '#7C3AED',
            text: (
              <div>
                <Text strong>{user.username || user.firstName || 'New User'}</Text> joined the system
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user.email} {user.role && `• Role: ${user.role}`}
                </Text>
              </div>
            ),
            timestamp: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Recently',
            type: 'user'
          });
        });

        // Add recent exhibitions
        stats.recentExhibitions.forEach(exhibition => {
          activities.push({
            id: `exhibition-${exhibition._id}`,
            icon: <FileOutlined />,
            color: '#059669',
            text: (
              <div>
                <Text strong>Exhibition "{exhibition.name}"</Text> was created
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {exhibition.location || 'Location TBD'} • {exhibition.startDate ? new Date(exhibition.startDate).toLocaleDateString() : 'Date TBD'}
                </Text>
              </div>
            ),
            timestamp: new Date(exhibition.createdAt).toLocaleString(),
            type: 'exhibition'
          });
        });
        
        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        notification.error({
          message: 'Error Loading Dashboard',
          description: 'Failed to load dashboard data. Please refresh the page.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  // Calendar date change handler
  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  // Calendar date cell render function - minimal holiday indicator
  const dateCellRender = (value: Dayjs) => {
    const holiday = getHoliday(value);
    
    if (holiday) {
      return (
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '4px',
          height: '4px',
          backgroundColor: '#f59e0b',
          borderRadius: '50%',
          opacity: 0.8
        }} 
        title={holiday} />
      );
    }
    
    return null;
  };

  return (
    <div className="modern-dashboard">
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {/* Greeting and Time Card */}
        <Col xs={24} sm={12} lg={8}>
          <GreetingCard currentTime={currentTime} quote={motivationalQuote} />
        </Col>

        {/* Motivational Quote Card */}
        <Col xs={24} sm={12} lg={8}>
          <QuoteCard quote={motivationalQuote} />
        </Col>

        {/* Calendar Card */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                Calendar
              </Space>
            }
            className="dashboard-card calendar-card"
            style={{ height: '100%', minHeight: '400px' }}
          >
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onSelect={onDateSelect}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Activity */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Activity
              </Space>
            }
            className="dashboard-card"
            extra={<Button type="link" size="small">View All</Button>}
            loading={loading}
          >
            {recentActivity.length > 0 ? (
              <Timeline
                items={recentActivity.slice(0, 8).map(activity => ({
                  dot: React.cloneElement(activity.icon as React.ReactElement, { 
                    style: { color: activity.color } 
                  }),
                  children: (
                    <div className="activity-item">
                      <div style={{ marginBottom: '4px' }}>
                        {activity.text}
                      </div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {activity.timestamp}
                      </Text>
                    </div>
                  )
                }))}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No recent activity"
                style={{ margin: '20px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
# Analytics - Occupancy Overview Explanation

## 📊 **How Occupancy Overview Works**

The **Occupancy Overview** section in the Analytics dashboard provides real-time insights into how stalls are being utilized in your exhibition. Here's how it works:

### **🔢 Data Calculation (Backend)**

#### **1. Stall Count Analysis**
```javascript
// Backend calculates stall counts by status
const totalStalls = stalls.length;
const bookedStalls = stalls.filter(stall => stall.status === 'booked').length;
const availableStalls = stalls.filter(stall => stall.status === 'available').length;
const reservedStalls = stalls.filter(stall => stall.status === 'reserved').length;
```

#### **2. Occupancy Rate Formula**
```javascript
// Occupancy Rate = (Booked Stalls / Total Stalls) × 100
occupancyRate = totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0
```

### **🎯 What Each Metric Means**

#### **Occupancy Rate**
- **Definition**: Percentage of stalls that are currently booked
- **Calculation**: `(Booked Stalls ÷ Total Stalls) × 100`
- **Color Coding**:
  - 🟢 **Green (≥70%)**: Excellent occupancy
  - 🟡 **Yellow (40-69%)**: Moderate occupancy
  - 🔴 **Red (<40%)**: Low occupancy

#### **Stall Status Breakdown**
1. **🟢 Booked**: Stalls with confirmed bookings (status = 'booked')
2. **🔵 Available**: Stalls ready for booking (status = 'available')
3. **🟡 Reserved**: Stalls temporarily held (status = 'reserved')

### **📈 Visual Indicators**

#### **Progress Bar**
- Dynamically colored based on occupancy rate
- Shows visual representation of how full the exhibition is
- Updates in real-time as bookings change

#### **Status Icons**
- ✅ **Check Circle**: Booked stalls
- 🕐 **Clock**: Available stalls
- ⚠️ **Exclamation**: Reserved stalls

### **🔄 Real-Time Updates**

The data updates automatically when:
- New stalls are created
- Stall statuses change
- Bookings are made/cancelled
- Stalls are deleted

### **💡 Business Insights**

#### **High Occupancy (70%+)**
- Strong demand for the exhibition
- Consider premium pricing for remaining stalls
- Plan for capacity management

#### **Moderate Occupancy (40-69%)**
- Normal booking pace
- May need marketing push
- Monitor trends closely

#### **Low Occupancy (<40%)**
- May need promotional campaigns
- Review pricing strategy
- Check competition factors

### **🔍 Troubleshooting**

#### **Data Not Updating?**
1. Refresh the page to reload data
2. Switch to another exhibition and back
3. Check if stalls exist for the selected exhibition

#### **Occupancy Rate Seems Wrong?**
1. Verify stall statuses in Stall Management
2. Ensure bookings are properly confirmed
3. Check for data synchronization

### **📊 Related Metrics**

The Occupancy Overview works in conjunction with:
- **Area Utilization**: Shows space usage by square meters
- **Stall Type Breakdown**: Detailed analysis by stall categories
- **Financial Overview**: Revenue implications of occupancy

### **🎯 Best Practices**

1. **Monitor Daily**: Check occupancy trends regularly
2. **Set Targets**: Aim for 70%+ occupancy for successful exhibitions
3. **Early Action**: Address low occupancy issues quickly
4. **Pricing Strategy**: Adjust rates based on demand patterns 
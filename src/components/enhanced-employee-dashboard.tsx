"use client"

import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Users, Plus, TrendingUp, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Building2, Bell, Settings, User, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data - replace with real API calls
const employeeData = {
  name: "John Doe",
  id: "EMP001",
  position: "Software Developer",
  startDate: "2023-01-15",
  salary: 75000,
  attendance: {
    present: 22,
    absent: 3,
    late: 2,
    totalWorkingDays: 26 // 6 days per week
  },
  vacation: {
    accumulated: 15,
    used: 5,
    remaining: 10,
    maxAllowed: 25
  },
  employeeFund: {
    monthlyContribution: 625,
    totalAccumulated: 12500,
    monthsWorked: 20
  },
  companyFund: {
    monthlyContribution: 625, // 10% of 75000/12
    totalAccumulated: 12500,
    monthsWorked: 20
  }
};

// Calendar data (mock attendance for current month)
const generateCalendarData = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const calendarData = {};
  
  // Generate mock attendance data
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Skip Sundays (6-day work week: Mon-Sat)
    if (dayOfWeek === 0) continue;
    
    // Mock data - replace with real attendance data
    const rand = Math.random();
    let status = 'present';
    if (rand < 0.05) status = 'absent';
    else if (rand < 0.1) status = 'late';
    
    calendarData[day] = {
      status,
      checkIn: status === 'absent' ? null : '09:00',
      checkOut: status === 'absent' ? null : '18:00'
    };
  }
  
  return { calendarData, daysInMonth, firstDay, month, year };
};

const CalendarComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { calendarData, daysInMonth, firstDay } = generateCalendarData();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'late': return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default: return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-3 h-3" />;
      case 'late': return <Clock className="w-3 h-3" />;
      case 'absent': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-6 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dayOfWeek = date.getDay();
          
          // Skip Sundays
          if (dayOfWeek === 0) return null;
          
          const attendance = calendarData[day];
          const status = attendance?.status || 'weekend';
          
          return (
            <TooltipProvider key={day}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`aspect-square border rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-colors ${getStatusColor(status)}`}
                  >
                    <span className="font-medium">{day}</span>
                    {attendance && (
                      <div className="flex items-center space-x-1 mt-1">
                        {getStatusIcon(status)}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{status}</p>
                  {attendance && attendance.checkIn && (
                    <p className="text-xs">
                      {attendance.checkIn} - {attendance.checkOut}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      
      <div className="flex justify-center space-x-4 text-xs pt-4 border-t">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
};

export default function EnhancedEmployeeDashboard() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState('vacation');
  const [requestSubType, setRequestSubType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleRequestClick = (type, subType = '') => {
    setRequestType(type);
    setRequestSubType(subType);
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    console.log('Request submitted:', { requestType, requestSubType, startDate, endDate, reason });
    setShowRequestDialog(false);
    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const attendancePercentage = (employeeData.attendance.present / employeeData.attendance.totalWorkingDays) * 100;
  const vacationUsagePercentage = (employeeData.vacation.used / employeeData.vacation.maxAllowed) * 100;

  const getRequestTitle = () => {
    if (requestType === 'vacation') return 'Request Vacation Days';
    if (requestType === 'fund' && requestSubType === 'employee') return 'Request Employee Fund';
    if (requestType === 'fund' && requestSubType === 'company') return 'Request Company Fund';
    if (requestType === 'attendance') return 'Request Attendance Adjustment';
    if (requestType === 'absence') return 'Request Absence Excuse';
    if (requestType === 'late') return 'Report Late Arrival Issue';
    if (requestType === 'salary') return 'Salary Inquiry';
    return 'General Request';
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {employeeData.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleRequestClick('general')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Quick Request
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
            
            {/* Employee Info Bar */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{employeeData.id}</Badge>
                <span>{employeeData.position}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Started: {new Date(employeeData.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Badge variant="success">6-day work week</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Attendance Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Attendance</p>
                    <p className="text-3xl font-bold text-gray-900">{attendancePercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">{employeeData.attendance.present}/{employeeData.attendance.totalWorkingDays} days</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleRequestClick('attendance')}>
                  Request Adjustment
                </Button>
              </CardContent>
            </Card>

            {/* Absences Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Absences</p>
                    <p className="text-3xl font-bold text-gray-900">{employeeData.attendance.absent}</p>
                    <p className="text-xs text-gray-500">Unexcused absences</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleRequestClick('absence')}>
                  Request Excuse
                </Button>
              </CardContent>
            </Card>

            {/* Late Arrivals Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Late Arrivals</p>
                    <p className="text-3xl font-bold text-gray-900">{employeeData.attendance.late}</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleRequestClick('late')}>
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Vacation Days */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Vacation Days</p>
                    <p className="text-3xl font-bold text-gray-900">{employeeData.vacation.remaining}</p>
                    <p className="text-xs text-gray-500">of {employeeData.vacation.maxAllowed} available</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleRequestClick('vacation')}>
                  Request Vacation
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Salary */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Monthly Salary</p>
                    <p className="text-3xl font-bold text-gray-900">${(employeeData.salary / 12).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">${(employeeData.salary / 312).toFixed(2)} daily</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleRequestClick('salary')}>
                  Salary Inquiry
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Calendar */}
            <Card className="lg:col-span-1 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Calendar</CardTitle>
                <CardDescription>Track your daily attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent />
              </CardContent>
            </Card>

            {/* Vacation Overview */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Vacation Overview</CardTitle>
                    <CardDescription>Manage your time off</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleRequestClick('vacation')}>
                    Request Days
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Vacation Usage</span>
                    <span className="text-sm font-medium">{employeeData.vacation.used}/{employeeData.vacation.maxAllowed} days</span>
                  </div>
                  <Progress value={vacationUsagePercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{employeeData.vacation.accumulated}</p>
                    <p className="text-xs text-gray-600 mt-1">Accumulated</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{employeeData.vacation.used}</p>
                    <p className="text-xs text-gray-600 mt-1">Used</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{employeeData.vacation.remaining}</p>
                    <p className="text-xs text-gray-600 mt-1">Remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Fund */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Employee Fund</CardTitle>
                    <CardDescription>Your personal savings fund</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleRequestClick('fund', 'employee')}>
                    Request Fund
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">${employeeData.employeeFund.totalAccumulated.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Accumulated</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-lg font-semibold text-blue-900">${employeeData.employeeFund.monthlyContribution}</p>
                    <p className="text-xs text-blue-700 mt-1">Monthly</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-lg font-semibold text-blue-900">{employeeData.employeeFund.monthsWorked}</p>
                    <p className="text-xs text-blue-700 mt-1">Months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Fund and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Company Fund */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Company Fund (10% Match)</CardTitle>
                    <CardDescription>Company contribution to your fund</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleRequestClick('fund', 'company')}>
                    Request Fund
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">${employeeData.companyFund.totalAccumulated.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Company Contribution</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-lg font-semibold text-green-900">${employeeData.companyFund.monthlyContribution}</p>
                    <p className="text-xs text-green-700 mt-1">10% of Salary</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-lg font-semibold text-green-900">{employeeData.companyFund.monthsWorked}</p>
                    <p className="text-xs text-green-700 mt-1">Months</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Total Combined Funds</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    ${(employeeData.employeeFund.totalAccumulated + employeeData.companyFund.totalAccumulated).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest updates and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Perfect attendance this week</p>
                      <p className="text-xs text-green-700">6 days worked (Mon-Sat)</p>
                    </div>
                    <Badge variant="success">Achievement</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Vacation request approved</p>
                      <p className="text-xs text-blue-700">October 1-3, 2025</p>
                    </div>
                    <Badge variant="default">Approved</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">Company fund contribution</p>
                      <p className="text-xs text-yellow-700">Monthly $625 added to fund</p>
                    </div>
                    <Badge variant="warning">Update</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">Late arrival recorded</p>
                      <p className="text-xs text-orange-700">September 20, 2025 - 9:15 AM</p>
                    </div>
                    <Badge variant="warning">Late</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Dialog */}
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{getRequestTitle()}</DialogTitle>
                <DialogDescription>
                  Fill out the form below to submit your request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {(requestType === 'vacation' || requestType === 'attendance' || requestType === 'absence' || requestType === 'late') && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                )}

                {requestType === 'fund' && (
                  <div className="space-y-4">
                    <Input
                      label="Amount Requested"
                      type="number"
                      placeholder="Enter amount"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Request Reason</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="medical">Medical Expenses</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {requestSubType === 'employee' && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Available Employee Fund:</strong> ${employeeData.employeeFund.totalAccumulated.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {requestSubType === 'company' && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Available Company Fund:</strong> ${employeeData.companyFund.totalAccumulated.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Company fund requests require additional approval
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {requestType === 'salary' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Inquiry Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raise">Salary Raise Request</SelectItem>
                          <SelectItem value="review">Salary Review</SelectItem>
                          <SelectItem value="discrepancy">Payment Discrepancy</SelectItem>
                          <SelectItem value="bonus">Bonus Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-800">
                        <strong>Current Annual Salary:</strong> ${employeeData.salary.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-800 mt-1">
                        <strong>Monthly:</strong> ${(employeeData.salary / 12).toLocaleString()} | 
                        <strong> Daily:</strong> ${(employeeData.salary / 312).toFixed(2)} (6-day week)
                      </p>
                    </div>
                  </div>
                )}

                {requestType === 'general' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Request Type</label>
                    <Select value={requestSubType} onValueChange={setRequestSubType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vacation">Vacation Day</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="personal">Personal Day</SelectItem>
                        <SelectItem value="emergency">Emergency Leave</SelectItem>
                        <SelectItem value="fund_employee">Employee Fund Request</SelectItem>
                        <SelectItem value="fund_company">Company Fund Request</SelectItem>
                        <SelectItem value="attendance">Attendance Issue</SelectItem>
                        <SelectItem value="salary">Salary Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Textarea
                  label={`Reason${requestType === 'fund' || requestType === 'salary' ? ' / Details' : ' (Optional)'}`}
                  placeholder={
                    requestType === 'fund' ? 'Please explain why you need this fund withdrawal...' :
                    requestType === 'salary' ? 'Please provide details about your inquiry...' :
                    'Please provide a brief reason for your request...'
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required={requestType === 'fund' || requestType === 'salary'}
                />
                
                {requestType === 'vacation' && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Available vacation days:</strong> {employeeData.vacation.remaining} days
                    </p>
                  </div>
                )}

                {requestType === 'attendance' && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Current attendance:</strong> {attendancePercentage.toFixed(1)}% ({employeeData.attendance.present}/{employeeData.attendance.totalWorkingDays} days)
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
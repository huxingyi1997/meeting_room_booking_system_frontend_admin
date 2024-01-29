import { Button, DatePicker, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { HttpStatusCode } from 'axios';
import { statisticApiInterface } from '@/api';

interface UserBookingData {
  userId: string;
  username: string;
  bookingCount: string;
}
interface MeetingRoomUsedData {
  meetingRoomName: string;
  meetingRoomId: number;
  usedCount: string;
}

const Statistics = () => {
  const [userBookingData, setUserBookingData] = useState<Array<UserBookingData>>();
  const [meetingRoomUsedData, setMeetingRoomUsedData] = useState<Array<MeetingRoomUsedData>>();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  const getStatisticData = useCallback(async (values: { startTime: string; endTime: string }) => {
    const startTime = dayjs(values.startTime).format('YYYY-MM-DD');
    const endTime = dayjs(values.endTime).format('YYYY-MM-DD');

    const res = await statisticApiInterface.statisticControllerUserBookignCount(startTime, endTime);
    // @ts-ignore
    const { data } = res.data;
    if (res.status === HttpStatusCode.Ok && data) {
      setUserBookingData(data);
    }
    const res2 = await statisticApiInterface.statisticControllerMeetingRoomUsedCount(startTime, endTime);
    // @ts-ignore
    const { data: data2 } = res2.data;
    if (res2.status === HttpStatusCode.Ok) {
      setMeetingRoomUsedData(data2);
    }
  }, []);

  useEffect(() => {
    const myChart = echarts.init(containerRef.current);

    if (!userBookingData) {
      return;
    }

    myChart.setOption({
      title: {
        text: '用户预定情况',
      },
      tooltip: {},
      xAxis: {
        data: userBookingData?.map(item => item.username),
      },
      yAxis: {},
      series: [
        {
          name: '预定次数',
          type: form.getFieldValue('chartType'),
          data: userBookingData?.map(item => {
            return {
              name: item.username,
              value: item.bookingCount,
            };
          }),
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBookingData]);

  useEffect(() => {
    const myChart = echarts.init(containerRef2.current);

    if (!meetingRoomUsedData) {
      return;
    }

    myChart.setOption({
      title: {
        text: '会议室使用情况',
      },
      tooltip: {},
      xAxis: {
        data: meetingRoomUsedData?.map(item => item.meetingRoomName),
      },
      yAxis: {},
      series: [
        {
          name: '使用次数',
          type: form.getFieldValue('chartType'),
          data: meetingRoomUsedData?.map(item => {
            return {
              name: item.meetingRoomName,
              value: item.usedCount,
            };
          }),
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingRoomUsedData]);

  const [form] = useForm();

  return (
    <div id="statistics-container">
      <div className="statistics-form">
        <Form form={form} onFinish={getStatisticData} name="search" layout="inline" colon={false}>
          <Form.Item label="开始日期" name="startTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="结束日期" name="endTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="图表类型" name="chartType" initialValue={'bar'}>
            <Select>
              <Select.Option value="pie">饼图</Select.Option>
              <Select.Option value="bar">柱形图</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="statistics-chart" ref={containerRef}></div>
      <div className="statistics-chart" ref={containerRef2}></div>
    </div>
  );
};

export default Statistics;

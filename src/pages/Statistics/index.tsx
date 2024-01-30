import { Button, DatePicker, Form, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { HttpStatusCode } from 'axios';

import { statisticApiInterface } from '@/api';
import { MeetingRoomUsedCountVo, UserBookignCountVo } from '@/api/autogen';

const Statistics = () => {
  const [userBookingData, setUserBookingData] = useState<Array<UserBookignCountVo>>();
  const [meetingRoomUsedData, setMeetingRoomUsedData] = useState<Array<MeetingRoomUsedCountVo>>();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  const getStatisticData = useCallback(async (values: { startTime: string; endTime: string }) => {
    const startTime = dayjs(values.startTime).format('YYYY-MM-DD');
    const endTime = dayjs(values.endTime).format('YYYY-MM-DD');

    const res = await statisticApiInterface.statisticControllerUserBookignCount(startTime, endTime);
    const { data: userBookingData } = res.data;
    if (res.status === HttpStatusCode.Ok && userBookingData) {
      setUserBookingData(userBookingData);
    }
    const res2 = await statisticApiInterface.statisticControllerMeetingRoomUsedCount(startTime, endTime);
    const { data: meetingRoomUsedData } = res2.data;
    if (res2.status === HttpStatusCode.Ok && meetingRoomUsedData) {
      setMeetingRoomUsedData(meetingRoomUsedData);
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
    <div id="statistics-container" className="p-5 flex flex-col items-center">
      <div className="mb-10 w-full">
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

      <div className="w-800 h-600" ref={containerRef}></div>
      <div className="w-800 h-600" ref={containerRef2}></div>
    </div>
  );
};

export default Statistics;

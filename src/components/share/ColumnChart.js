import { Column } from '@ant-design/plots';

const ColumnChart = ({ data }) => {
  const config = {
    data,
    color: '#6366f1',
    xField: 'name',
    yField: 'value',
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: 0,
      end: 0.3,
    },
  };

  return <Column {...config} />;
};

export default ColumnChart;

import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface TimelineStep {
  status: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface OrderTimelineProps {
  currentStatus: string;
  className?: string;
}

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED'];

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
};

export const OrderTimeline = ({ currentStatus, className }: OrderTimelineProps) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  const steps: TimelineStep[] = statusOrder.map((status, index) => ({
    status,
    label: statusLabels[status] || status,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-card', className)}>
      <h3 className="font-semibold text-accent-900 mb-6">Trạng thái đơn hàng</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-accent-200 mx-4">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (statusOrder.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-primary"
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step.completed
                    ? 'bg-primary text-white'
                    : 'bg-accent-100 text-accent-400'
                )}
              >
                {step.completed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span
                className={cn(
                  'mt-2 text-xs text-center max-w-[80px]',
                  step.completed ? 'text-primary font-medium' : 'text-accent-400'
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

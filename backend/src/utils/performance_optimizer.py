"""
High-Performance Optimization System
Lightning-fast prompt enhancement with intelligent caching and async processing
"""

import asyncio
import time
import hashlib
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
import threading
from collections import defaultdict, deque
import psutil
import gc

class PerformanceOptimizer:
    """Production-grade performance optimization for prompt enhancement"""
    
    def __init__(self):
        self.cache = {}
        self.cache_stats = defaultdict(int)
        self.cache_lock = threading.RLock()
        self.request_queue = deque()
        self.batch_processor = None
        self.thread_pool = ThreadPoolExecutor(max_workers=8)
        self.performance_metrics = defaultdict(list)
        self.system_monitor = SystemMonitor()
        
        # Advanced caching configuration
        self.cache_ttl = 3600  # 1 hour
        self.max_cache_size = 10000
        self.cache_cleanup_interval = 300  # 5 minutes
        
        # Performance thresholds
        self.slow_response_threshold = 2000  # 2 seconds
        self.critical_response_threshold = 5000  # 5 seconds
        
        # Start background tasks
        self._start_cache_cleanup()
        self._start_performance_monitoring()
    
    def get_cache_key(self, prompt: str, techniques: List[str], method: str = 'llm') -> str:
        """Generate optimized cache key with techniques fingerprinting"""
        # Create a stable hash from techniques
        techniques_hash = hashlib.md5(','.join(sorted(techniques)).encode()).hexdigest()[:8]
        prompt_hash = hashlib.md5(prompt.encode()).hexdigest()[:12]
        
        return f"{method}:{prompt_hash}:{techniques_hash}"
    
    def get_cached_result(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Retrieve cached result with performance tracking"""
        start_time = time.time()
        
        with self.cache_lock:
            if cache_key in self.cache:
                cached_data = self.cache[cache_key]
                
                # Check if cache entry is still valid
                if time.time() - cached_data['timestamp'] < self.cache_ttl:
                    self.cache_stats['hits'] += 1
                    self.cache_stats['hit_time'] += (time.time() - start_time) * 1000
                    
                    # Move to front for LRU behavior
                    cached_data['last_accessed'] = time.time()
                    
                    return cached_data['result']
                else:
                    # Expired, remove entry
                    del self.cache[cache_key]
                    self.cache_stats['expired'] += 1
        
        self.cache_stats['misses'] += 1
        return None
    
    def cache_result(self, cache_key: str, result: Dict[str, Any]) -> None:
        """Cache result with intelligent memory management"""
        with self.cache_lock:
            # Cleanup if cache is getting too large
            if len(self.cache) >= self.max_cache_size:
                self._cleanup_old_entries()
            
            self.cache[cache_key] = {
                'result': result,
                'timestamp': time.time(),
                'last_accessed': time.time(),
                'access_count': 1
            }
            
            self.cache_stats['stored'] += 1
    
    def _cleanup_old_entries(self) -> None:
        """Remove least recently used cache entries"""
        if len(self.cache) < self.max_cache_size * 0.8:
            return
        
        # Sort by last accessed time and remove oldest 20%
        entries_to_remove = int(len(self.cache) * 0.2)
        sorted_entries = sorted(
            self.cache.items(),
            key=lambda x: x[1]['last_accessed']
        )
        
        for cache_key, _ in sorted_entries[:entries_to_remove]:
            del self.cache[cache_key]
        
        self.cache_stats['cleaned'] += entries_to_remove
    
    def _start_cache_cleanup(self) -> None:
        """Start background cache cleanup task"""
        def cleanup_worker():
            while True:
                time.sleep(self.cache_cleanup_interval)
                with self.cache_lock:
                    self._cleanup_old_entries()
                    gc.collect()  # Force garbage collection
        
        cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
        cleanup_thread.start()
    
    def _start_performance_monitoring(self) -> None:
        """Start performance monitoring background task"""
        def monitor_worker():
            while True:
                time.sleep(60)  # Check every minute
                self._collect_performance_metrics()
        
        monitor_thread = threading.Thread(target=monitor_worker, daemon=True)
        monitor_thread.start()
    
    def _collect_performance_metrics(self) -> None:
        """Collect system and application performance metrics"""
        metrics = {
            'timestamp': time.time(),
            'cache_size': len(self.cache),
            'cache_hit_rate': self._calculate_hit_rate(),
            'memory_usage': self.system_monitor.get_memory_usage(),
            'cpu_usage': self.system_monitor.get_cpu_usage(),
            'response_times': list(self.performance_metrics['response_times'][-100:])  # Last 100
        }
        
        self.performance_metrics['system'].append(metrics)
        
        # Keep only last hour of metrics
        cutoff_time = time.time() - 3600
        self.performance_metrics['system'] = [
            m for m in self.performance_metrics['system']
            if m['timestamp'] > cutoff_time
        ]
    
    def _calculate_hit_rate(self) -> float:
        """Calculate cache hit rate percentage"""
        hits = self.cache_stats['hits']
        total = hits + self.cache_stats['misses']
        return (hits / total * 100) if total > 0 else 0.0
    
    def record_response_time(self, response_time_ms: int) -> None:
        """Record response time for performance analysis"""
        self.performance_metrics['response_times'].append({
            'timestamp': time.time(),
            'response_time': response_time_ms
        })
        
        # Alert on slow responses
        if response_time_ms > self.critical_response_threshold:
            print(f"🚨 CRITICAL: Response time {response_time_ms}ms exceeds threshold")
        elif response_time_ms > self.slow_response_threshold:
            print(f"⚠️ WARNING: Slow response time {response_time_ms}ms")
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get comprehensive performance statistics"""
        with self.cache_lock:
            recent_times = [
                m['response_time'] for m in self.performance_metrics['response_times'][-50:]
            ]
            
            avg_response_time = sum(recent_times) / len(recent_times) if recent_times else 0
            
            return {
                'cache': {
                    'size': len(self.cache),
                    'hit_rate': round(self._calculate_hit_rate(), 2),
                    'hits': self.cache_stats['hits'],
                    'misses': self.cache_stats['misses'],
                    'stored': self.cache_stats['stored'],
                    'cleaned': self.cache_stats['cleaned'],
                    'expired': self.cache_stats['expired']
                },
                'performance': {
                    'avg_response_time_ms': round(avg_response_time, 2),
                    'total_requests': len(self.performance_metrics['response_times']),
                    'slow_requests': len([
                        t for t in recent_times 
                        if t > self.slow_response_threshold
                    ]),
                    'critical_requests': len([
                        t for t in recent_times 
                        if t > self.critical_response_threshold
                    ])
                },
                'system': {
                    'memory_usage_mb': self.system_monitor.get_memory_usage(),
                    'cpu_usage_percent': self.system_monitor.get_cpu_usage(),
                    'active_threads': threading.active_count()
                }
            }
    
    @lru_cache(maxsize=128)
    def get_technique_fingerprint(self, techniques_tuple: Tuple[str, ...]) -> str:
        """Generate cached fingerprint for technique combinations"""
        return hashlib.md5(','.join(sorted(techniques_tuple)).encode()).hexdigest()[:8]
    
    async def process_enhancement_async(self, enhancement_func, *args, **kwargs) -> Dict[str, Any]:
        """Process enhancement asynchronously for better performance"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.thread_pool, enhancement_func, *args, **kwargs)
    
    def optimize_prompt_processing(self, prompt: str, techniques: List[str]) -> Tuple[str, List[str]]:
        """Pre-process prompt and techniques for optimal performance"""
        # Remove redundant whitespace from prompt
        optimized_prompt = ' '.join(prompt.split())
        
        # Deduplicate and sort techniques for consistent caching
        optimized_techniques = sorted(list(set(techniques)))
        
        return optimized_prompt, optimized_techniques


class SystemMonitor:
    """System resource monitoring for performance optimization"""
    
    def __init__(self):
        self.process = psutil.Process()
    
    def get_memory_usage(self) -> float:
        """Get current memory usage in MB"""
        try:
            return round(self.process.memory_info().rss / 1024 / 1024, 2)
        except:
            return 0.0
    
    def get_cpu_usage(self) -> float:
        """Get current CPU usage percentage"""
        try:
            return round(self.process.cpu_percent(), 2)
        except:
            return 0.0
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health metrics"""
        try:
            memory_info = self.process.memory_info()
            cpu_times = self.process.cpu_times()
            
            return {
                'memory': {
                    'rss_mb': round(memory_info.rss / 1024 / 1024, 2),
                    'vms_mb': round(memory_info.vms / 1024 / 1024, 2),
                    'percent': round(self.process.memory_percent(), 2)
                },
                'cpu': {
                    'percent': round(self.process.cpu_percent(), 2),
                    'user_time': round(cpu_times.user, 2),
                    'system_time': round(cpu_times.system, 2)
                },
                'threads': self.process.num_threads(),
                'connections': len(self.process.connections()),
                'uptime_seconds': round(time.time() - self.process.create_time(), 2)
            }
        except Exception as e:
            return {'error': str(e)}


# Global optimizer instance
performance_optimizer = PerformanceOptimizer()


class FastPromptProcessor:
    """Ultra-fast prompt processing with advanced optimizations"""
    
    @staticmethod
    def precompile_techniques(techniques: List[str]) -> Dict[str, Any]:
        """Pre-compile technique patterns for faster execution"""
        compiled_patterns = {}
        
        for technique in techniques:
            if technique == 'compression':
                # Pre-compile regex patterns for compression
                import re
                compiled_patterns[technique] = [
                    re.compile(pattern, re.IGNORECASE) for pattern, _ in [
                        (r'\bplease\s+', ''),
                        (r'\bcould\s+you\s+', ''),
                        (r'\bi\s+would\s+like\s+you\s+to\s+', ''),
                        (r'\bmake\s+sure\s+that\s+', 'ensure '),
                        (r'\bin\s+order\s+to\s+', 'to '),
                        (r'\bas\s+well\s+as\s+', 'and ')
                    ]
                ]
        
        return compiled_patterns
    
    @staticmethod
    def batch_process_techniques(prompts_and_techniques: List[Tuple[str, List[str]]]) -> List[str]:
        """Process multiple prompts in batch for efficiency"""
        results = []
        
        # Group by similar technique sets for batch optimization
        technique_groups = defaultdict(list)
        for i, (prompt, techniques) in enumerate(prompts_and_techniques):
            tech_key = ','.join(sorted(techniques))
            technique_groups[tech_key].append((i, prompt))
        
        # Process each group efficiently
        for tech_key, prompt_items in technique_groups.items():
            techniques = tech_key.split(',') if tech_key else []
            compiled_patterns = FastPromptProcessor.precompile_techniques(techniques)
            
            for original_index, prompt in prompt_items:
                # Fast processing logic here
                processed = prompt  # Placeholder for actual processing
                results.append((original_index, processed))
        
        # Return results in original order
        results.sort(key=lambda x: x[0])
        return [result[1] for result in results] 
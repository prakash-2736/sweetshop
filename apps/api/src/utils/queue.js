/**
 * Background Job Queue Simulation
 * Enables asynchronous task execution to optimize response latency.
 */
class JobQueue {
  constructor() {
    this.jobs = [];
    this.isProcessing = false;
  }

  /**
   * Add a task to the background processing queue
   * @param {string} jobName 
   * @param {function} handler - Async function to run
   * @param {object} data - Parameters for the function
   */
  enqueue(jobName, handler, data = {}) {
    this.jobs.push({
      id: `${jobName}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: jobName,
      handler,
      data,
      retries: 3,
    });

    console.log(`[Queue Enqueued] Job: ${jobName}`);
    
    // Trigger loop execution asynchronously
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.jobs.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const job = this.jobs.shift();

    try {
      console.log(`[Queue Start] Processing Job ID: ${job.id}`);
      await job.handler(job.data);
      console.log(`[Queue Success] Completed Job ID: ${job.id}`);
    } catch (err) {
      console.error(`[Queue Failure] Job ID: ${job.id} failed with error: ${err.message}`);
      
      if (job.retries > 0) {
        job.retries--;
        console.log(`[Queue Retry] Re-enqueueing Job ID: ${job.id}. Retries left: ${job.retries}`);
        this.jobs.push(job);
      }
    }

    // Schedule next job
    setTimeout(() => this.processQueue(), 50);
  }
}

module.exports = new JobQueue();

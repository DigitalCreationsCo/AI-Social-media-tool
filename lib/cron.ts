import cron from 'node-cron';
import Parser from 'rss-parser';
import { socialApiUrl} from './social'

const CRON_SECRET = process.env.CRON_SECRET;

export function startCronJobs() {
  console.info('Starting cron jobs...');
  scheduleIGFeedJob();
  scheduleRedditFeedJob();
  scheduleRssFeedJob();
}

async function scheduleIGFeedJob() {
  // Schedule job to run every hour
  typeof window === 'undefined' && await (await import('node-cron')).default.schedule('0 * * * *', async () => {
    try {
      console.log('Fetching IG feed...');
      
      const response = await fetch(socialApiUrl('instagram'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CRON_SECRET}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch IG feed: ${response.statusText}`);
      }

      console.log('IG feed processing completed');
    } catch (error) {
      console.error('IG error:', error);
    }
  });
}

async function scheduleRedditFeedJob() {
  // Schedule job to run every hour
  typeof window === 'undefined' && await (await import('node-cron')).default.schedule('0 * * * *', async () => {
    try {
      console.log('Fetching Reddit feed...');
      
      const response = await fetch(socialApiUrl('reddit'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CRON_SECRET}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch Reddit feed: ${response.statusText}`);
      }

      console.log('Reddit feed processing completed');
    } catch (error) {
      console.error('Reddit error:', error);
    }
  });
}

async function scheduleRssFeedJob() {
  // Schedule job to run every hour
  typeof window === 'undefined' && await (await import('node-cron')).default.schedule('0 * * * *', async () => {
    try {
      console.log('Fetching RSS feed...');
      const parser = new Parser();

      const feed = await parser.parseURL(socialApiUrl('rss'));
      
      // Process each item in the feed
      for (const item of feed.items) {
        await processRssItem(item);
      }
      
      console.log('RSS feed processing completed');
    } catch (error) {
      console.error('Failed to fetch or process RSS feed:', error);
    }
  });
}

async function processRssItem(item) {
  try {
    // Here you can process each RSS item as needed
    // For example, you might want to save it to your database
    const response = await fetch('http://localhost:3000/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRON_SECRET}`
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error(`Failed to save RSS item: ${response.statusText}`);
    }

    console.log(`Processed RSS item: ${item.title}`);
  } catch (error) {
    console.error(`Error processing RSS item: ${error.message}`);
  }
}
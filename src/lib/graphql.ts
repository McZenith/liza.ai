const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/graphql';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5002/graphql';

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T; errors?: Array<{ message: string }> }> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  return response.json();
}

// WebSocket subscription for real-time updates
export function subscribeToLongTailAnalysis(
  parentKeyword: string,
  onUpdate: (data: LongTailUpdate) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): () => void {
  const ws = new WebSocket(WS_URL, 'graphql-transport-ws');

  let connectionAckReceived = false;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'connection_init' }));
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'connection_ack') {
      connectionAckReceived = true;
      ws.send(JSON.stringify({
        id: '1',
        type: 'subscribe',
        payload: {
          query: LONG_TAIL_SUBSCRIPTION,
          variables: { parentKeyword },
        },
      }));
    } else if (message.type === 'next' && message.payload?.data?.onLongTailAnalyzed) {
      const update = message.payload.data.onLongTailAnalyzed;
      onUpdate(update);
      if (update.isComplete) {
        onComplete();
      }
    } else if (message.type === 'error') {
      onError(new Error(message.payload?.[0]?.message || 'Subscription error'));
    } else if (message.type === 'complete') {
      onComplete();
    }
  };

  ws.onerror = () => {
    onError(new Error('WebSocket connection failed'));
  };

  ws.onclose = () => {
    if (!connectionAckReceived) {
      onError(new Error('WebSocket connection closed before acknowledgement'));
    }
  };

  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ id: '1', type: 'complete' }));
      ws.close();
    }
  };
}

export interface LongTailUpdate {
  parentKeyword: string;
  longTailKeyword: string;
  opportunity: number;
  difficulty: number;
  grade: string;
  searchVolume: number;
  competitionLevel: string;
  videoCount: number;
  avgCompetitorViews: number;
  source: string;
  isComplete: boolean;
  analyzedCount: number;
  totalCount: number;
  allResults: Array<{
    keyword: string;
    grade: string;
    opportunity: number;
    difficulty: number;
    searchVolume: number;
    source: string;
  }>;
}

// GraphQL Queries
export const ANALYZE_KEYWORD_QUERY = `
  query AnalyzeKeyword($keyword: String!, $maxLongTails: Int) {
    analyzeKeyword(keyword: $keyword, maxLongTails: $maxLongTails) {
      keyword
      analyzedAt
      searchDemand {
        volume
        trendType
        momentum
        seasonalPeak
      }
      contentSupply {
        videoCount
        totalSearchResults
        contentGapScore
        competitionLevel
        avgCompetitorViews
        videosUploadedToday
        videosLast3Days
        videosThisWeek
        videosThisMonth
        videosThisYear
        isDormantOpportunity
        contentActivityLevel
      }
      scores {
        opportunity
        difficulty
        grade
      }
      recommendations {
        titlePatterns
        mustHaveTags
        optimalLengthSeconds
        topQuestions
        relatedKeywords
      }
    }
  }
`;

export const GET_AUTOCOMPLETE_QUERY = `
  query GetAutocomplete($query: String!) {
    getAutocompleteSuggestions(query: $query) {
      youtube
      google
    }
  }
`;

const LONG_TAIL_SUBSCRIPTION = `
  subscription OnLongTailAnalyzed($parentKeyword: String!) {
    onLongTailAnalyzed(parentKeyword: $parentKeyword) {
      parentKeyword
      longTailKeyword
      opportunity
      difficulty
      grade
      searchVolume
      competitionLevel
      videoCount
      avgCompetitorViews
      source
      isComplete
      analyzedCount
      totalCount
      allResults {
        keyword
        grade
        opportunity
        difficulty
        searchVolume
        source
      }
    }
  }
`;

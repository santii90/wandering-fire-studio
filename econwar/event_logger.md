---
date: 2025-04-01T16:38:12
---
# Event Logger System for Godot 4 Strategy Game

## Overview

The EventLogger is a singleton system that records game events to a SQLite database without impacting the main thread's performance. It's designed to be a non-intrusive addition to your existing game logic, allowing comprehensive event tracking with minimal performance impact.

## Key Features

- **Thread-Safe Processing**: All database operations happen in a separate thread
- **Batch Processing**: Events are collected and written in batches for optimal performance
- **SQLite with WAL Mode**: Uses Write-Ahead Logging for improved database performance
- **Querying Capabilities**: Retrieve events by type, time spans, or custom criteria
- **Safe Shutdown**: Ensures all pending events are properly saved on game exit
- **Multiplayer Ready**: Structure supports future multiplayer integration

## Usage

### Recording Events

```gdscript
# Basic usage - add an event with type and data
EventLogger.add_event(EventLogger.EventType.BATTLE, {
    "location": battle_location,
    "attacker": attacker_data,
    "defender": defender_data,
    "outcome": battle_result,
    "casualties": casualties
})

# Resource collection event
EventLogger.add_event(EventLogger.EventType.RESOURCE, {
    "type": resource_type,
    "amount": amount,
    "location": location_data
})

# Diplomatic event
EventLogger.add_event(EventLogger.EventType.DIPLOMACY, {
    "action": action_type,
    "target": target_faction,
    "success": success_status,
    "consequences": consequences_data
})
```

### Querying Events

```gdscript
# Get all events of a specific type
var all_battles = EventLogger.get_events_by_type(EventLogger.EventType.BATTLE)

# Get events within a time range
var current_time = Time.get_unix_time_from_system()
var one_day_ago = current_time - (24 * 60 * 60)
var recent_battles = EventLogger.get_events_by_type(EventLogger.EventType.BATTLE, one_day_ago)

# Get all events in a time span regardless of type
var recent_events = EventLogger.get_events_by_timespan(one_day_ago)

# Get database statistics
var stats = EventLogger.get_database_stats()
print("Total events: ", stats.total)
print("Battles: ", stats.by_type[EventLogger.EventType.BATTLE])
```

### Data Maintenance

```gdscript
# Clear old events (e.g., older than 30 days)
var thirty_days_ago = Time.get_unix_time_from_system() - (30 * 24 * 60 * 60)
var deleted_count = EventLogger.clear_events_older_than(thirty_days_ago)
print("Deleted ", deleted_count, " old events")
```

## Event Types

The EventLogger includes predefined event types:

- `BATTLE`: Combat encounters
- `RESOURCE`: Resource collection, production, or consumption
- `DIPLOMACY`: Diplomatic actions between factions
- `RESEARCH`: Technology research events
- `BUILDING`: Construction or destruction of buildings
- `UNIT`: Unit creation, training, or modification
- `PLAYER`: Player-specific actions
- `GAME`: General game state changes

## Technical Details

### Database Structure

Events are stored in an SQLite database with the following schema:

```sql
CREATE TABLE events (
    id TEXT PRIMARY KEY,        -- Unique ID for the event
    type INTEGER NOT NULL,      -- Event type (from EventType enum)
    timestamp INTEGER NOT NULL, -- Unix timestamp of the event
    origin TEXT NOT NULL,       -- Source of the event (client/server)
    data TEXT NOT NULL          -- JSON string with event data
);
```

Indices are created on `type` and `timestamp` fields for efficient querying.

### Threading and Synchronization

Events are added to a thread-safe queue and processed in batches by a separate thread. This design ensures that:

1. Adding events from gameplay code is non-blocking
2. Database operations don't cause frame rate drops
3. Events are safely persisted even during heavy gameplay

### Performance Considerations

- **Batch Size**: Default batch size is 20 events, adjust based on your game's needs
- **Flush Interval**: Events are flushed every 5 seconds or when batch size is reached
- **Memory Limit**: The system monitors queue size to prevent excessive memory usage
- **Retry Mechanism**: Failed database operations are retried with exponential backoff

## Implementation Details

### Key Components

1. **Singleton Initialization**: Sets up database, thread, and synchronization primitives
2. **Event Queue**: Thread-safe buffer for events before processing
3. **Processing Thread**: Runs in background to save events to database
4. **Query Interface**: Methods to retrieve and analyze stored events
5. **Shutdown Handler**: Ensures clean exit and saves pending events

### Customization

You can adjust the following parameters in the EventLogger script:

- `_db_path`: Location of the SQLite database file
- `_batch_size`: Number of events to process in one batch
- `_flush_interval_ms`: Maximum time to wait before processing a batch
- `_max_queue_size`: Warning threshold for queue size
- `_retry_attempts`: Number of retries for failed operations
- `_retry_delay_ms`: Delay between retry attempts

## Future Extensions

- Analytics dashboard for visualizing event data
- Event filtering and advanced queries
- Network synchronization for multiplayer games
- Compression for long-term storage
- Export/import functionality

## Integration Examples

See `scripts/event_logger_example.gd` for examples of:
- Logging battle events
- Tracking resource collection
- Recording diplomatic actions
- Querying historical events 
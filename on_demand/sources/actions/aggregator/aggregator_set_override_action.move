module switchboard::aggregator_set_override_action;

use switchboard::decimal::{Self, Decimal};
use switchboard::aggregator::{Self as Agg, Aggregator};
use sui::tx_context::TxContext;

/// Admin override: set current_result directly, bypassing median/oracle flow.
public entry fun run(
    aggregator: &mut Aggregator,
    value: u128,
    neg: bool,
    timestamp_seconds: u64,
    ctx: &mut TxContext,
) {
    // Convert to Decimal (convention: 18-decimal scaled u128)
    let v: Decimal = decimal::new(value, neg);

    // Write directly to current_result (ms precision)
    Agg::set_current_value_admin(aggregator, v, timestamp_seconds * 1000);
}


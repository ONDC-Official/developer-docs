**on_search,on_init,/on_confirm**

- remove static terms (bpp_terms) and cancellation terms as they are not enabled yet

**/on_cancel**

- fulfillments/start/instructions have changed for fulfillment type 'Delivery'
- In fulfillments/tags- precancel_state/updated_at is the time when this pre_cancel state was updated in the system (is not recorded correctly in Flow 2 (should reflect the timestamp recorded in fulfillments for this state in /on_status), missing in Flow 3)
- In /items, time/duration for RTO line item does not match the one provided in catalog in /on_search
- use appropriate cancellation reason id for triggering RTO

**/track,on_track**

- tracking apis should be implemented
- also add tracking.tags.order, tracking.tags.config;